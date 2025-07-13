import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";

const AZURE_CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER;
const BLOB_URL = process.env.AZURE_BLOB_URL;

const blobServiceClient =
  BlobServiceClient.fromConnectionString(AZURE_CONN_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// Ensure container exists (create if not)
async function ensureContainer() {
  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
  }
}

export const resumableUploadMiddleware = async (req, res, next) => {
  console.log('📤 Resume upload request received');
  console.log('📋 Request body:', req.body);
  console.log('📁 Files:', req.files);
  
  let { filename, chunkIndex, totalChunks } = req.body;
  let { fileId } = req.body;
  const chunk = req.files?.chunk?.[0];

  if (!chunk) {
      console.log('❌ No file chunk provided');
      return res.status(400).json({ message: "No file chunk provided." });
  }

  if (!fileId) {
      fileId = uuidv4(); // Generate a unique fileId
  }

  if (chunkIndex === undefined || totalChunks === undefined) {
      chunkIndex = 0;
      totalChunks = 1;
      console.log("Inferred single-chunk upload for file:", filename);
  } else {
      // Ensure they are numbers if provided
      chunkIndex = parseInt(chunkIndex);
      totalChunks = parseInt(totalChunks);
  }

  if (!filename || chunkIndex === undefined || isNaN(chunkIndex) || !totalChunks || isNaN(totalChunks) || !fileId) {
      return res.status(400).json({ message: "Missing or invalid required fields for upload." });
  }

   // Ensure fileId is a string, as Prisma expects a string for the ID
   if (typeof fileId !== 'string') {
     fileId = String(fileId);
   }

  const blockId = Buffer.from(uuidv4()).toString("base64");
  const blockBlobClient = containerClient.getBlockBlobClient(fileId + "-" + filename);

  try {
    await ensureContainer();

    // Stage the block
    await blockBlobClient.stageBlock(blockId, chunk.buffer, chunk.size);

    // Store blockId and chunkIndex for later commitment
    let resumableUploadRecord = await prisma.resumableUpload.findUnique({
      where: { fileId: fileId },
    });

    if (!resumableUploadRecord) {
      resumableUploadRecord = await prisma.resumableUpload.create({
        data: {
          fileId: fileId,
          fileName: filename,
          totalChunks: parseInt(totalChunks),
          uploadedBlocks: [blockId],
        },
      });
    } else {
      resumableUploadRecord = await prisma.resumableUpload.update({
        where: { fileId: fileId },
        data: {
          uploadedBlocks: {
            push: blockId,
          },
        },
      });
    }

    console.log(`Staged block ${chunkIndex}/${totalChunks} for file ${filename} with blockId ${blockId}`);

    // If this is the last chunk, commit the blocks
    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      // Retrieve all block IDs for this file
      const allBlockIds = resumableUploadRecord.uploadedBlocks;

      // Commit the blocks
      await blockBlobClient.commitBlockList(allBlockIds);
      console.log(`Committed all blocks for file ${filename}.`);

      // Clean up the resumable upload record
      await prisma.resumableUpload.delete({
        where: { fileId: fileId },
      });

      const fileUrl = `${BLOB_URL}/${CONTAINER_NAME}/${fileId}-${filename}`;
      console.log('✅ File uploaded successfully:', fileUrl);
      return res.status(200).json({ 
        success: true,
        message: "File uploaded successfully", 
        url: fileUrl 
      });

    }

    res.status(200).json({ message: "Chunk uploaded successfully", blockId });
  } catch (error) {
    console.error("Error during resumable upload:", error.message);
    res.status(500).json({ message: "Error uploading chunk.", details: error.message });
  };
};