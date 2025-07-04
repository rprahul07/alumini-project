import path from "path";
import fs from "fs";
import { promisify } from "util";
import { BlobServiceClient } from "@azure/storage-blob";
import prisma from "../lib/prisma.js";

const unlink = promisify(fs.unlink);

// Environment variables
const AZURE_CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER; // e.g., "alumniblob"
const BLOB_URL = process.env.AZURE_BLOB_URL; // e.g., "https://<account>.blob.core.windows.net"

// Initialize Blob Service Client
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

// Helper function to safely delete a blob
async function safeDeleteBlob(blobName) {
  try {
    const blobClient = containerClient.getBlobClient(blobName);
    const exists = await blobClient.exists();
    if (exists) {
      await blobClient.delete();
      console.log(`Successfully deleted blob: ${blobName}`);
      return true;
    } else {
      console.log(`Blob does not exist, skipping: ${blobName}`);
      return false;
    }
  } catch (error) {
    if (error.code === "BlobNotFound") {
      console.log(`Blob not found during deletion: ${blobName}`);
      return false;
    }
    console.error(`Error deleting blob ${blobName}:`, error);
    throw error;
  }
}

export const handlePhotoUpload = async (
  req,
  currentPhotoUrl = null,
  photoType,
  eventId = null
) => {
  try {
    // Get the photo file from various possible field names
    const photoFile =
      req.files?.photo?.[0] ||
      req.files?.profilePhoto?.[0] ||
      req.files?.eventPhoto?.[0];

    if (!photoFile) {
      console.warn("No photo file found in request");
      return null;
    }

    // Validate file type (optional)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photoFile.mimetype)) {
      console.error("Invalid file type:", photoFile.mimetype);
      return null;
    }

    const userId = req.user?.id;
    if (!userId) {
      console.error("No user ID found in request");
      return null;
    }

    const timestamp = Date.now();
    const prefix =
      photoType === "event" && eventId
        ? `event-${eventId}-${userId}-`
        : `user-${userId}-`;
    const extension = path.extname(photoFile.originalname);
    const blobName = `${prefix}${timestamp}${extension}`;

    // Prepare upload
    await ensureContainer();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload local temp file to Azure Blob Storage
    await blockBlobClient.uploadFile(photoFile.path, {
      blobHTTPHeaders: { blobContentType: photoFile.mimetype },
    });

    // Remove local file
    try {
      await unlink(photoFile.path);
    } catch (err) {
      console.warn("Could not remove temp file:", err.message);
    }
    //clean up of old images
    try {
      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        if (blob.name !== blobName) {
          await safeDeleteBlob(blob.name);
        }
      }
    } catch (error) {
      console.error("Error during blob cleanup:", error);
    }

    if (currentPhotoUrl) {
      try {
        const parts = currentPhotoUrl.split("/");
        const currentName = parts.pop();
        if (
          currentName &&
          currentName !== blobName &&
          currentName.startsWith(prefix)
        ) {
          await safeDeleteBlob(currentName);
        }
      } catch (error) {
        console.error("Error deleting current photo:", error);
      }
    }

    const photoUrl = `${BLOB_URL}/${CONTAINER_NAME}/${blobName}`;
    console.log("Photo uploaded successfully:", photoUrl);
    return photoUrl;
  } catch (error) {
    console.error("Error in handlePhotoUpload:", error);
    return null;
  }
};

export const updateEventImage = async (eventId, imageUrl) => {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { imageUrl },
    });
    console.log("Event image updated successfully:", eventId);
  } catch (error) {
    console.error("Error updating event image:", error);
    throw error;
  }
};

export const deletePhotoById = async (photoId) => {
  try {
    const record = await prisma.event.findUnique({
      where: { id: photoId },
      select: { imageUrl: true },
    });

    if (!record?.imageUrl) {
      console.warn("No photo found for ID:", photoId);
      return { success: false, message: "Photo not found." };
    }

    const parts = record.imageUrl.split("/");
    const blobName = parts.pop();

    const deleted = await safeDeleteBlob(blobName);

    if (deleted || !deleted) {
      // Update database regardless of blob deletion success
      await prisma.event.update({
        where: { id: photoId },
        data: { imageUrl: null },
      });

      console.log("Photo deleted successfully for event:", photoId);
      return { success: true, message: "Photo deleted successfully." };
    }
  } catch (error) {
    console.error("Error deleting photo by ID:", error);
    return { success: false, message: "Internal error occurred." };
  }
};
