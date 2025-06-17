import path from "path";
import fs from "fs";
import { promisify } from "util";
import prisma from "../lib/prisma.js";

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);
const rename = promisify(fs.rename);

export const handlePhotoUpload = async (
  req,
  currentPhotoUrl = null,
  photoType,
  eventId = null
) => {
  console.log("req.files =", req.files);
  const photoFile = req.files?.photo?.[0] || req.files?.profilePhoto?.[0];
  if (!photoFile) return null;
  const userId = req.user?.id;
  const timestamp = Date.now();

  const uploadsDir = path.join(process.cwd(), "uploads");

  let newFilename;
  if (photoType === "event" && eventId) {
    newFilename = `event-${eventId}-${userId}-${timestamp}${path.extname(
      photoFile.originalname
    )}`;
  } else if (photoType === "profile") {
    newFilename = `user-${userId}-${timestamp}${path.extname(
      photoFile.originalname
    )}`;
  } else {
    newFilename = `user-${userId}-${timestamp}${path.extname(
      photoFile.originalname
    )}`;
  }

  const oldPath = photoFile.path;
  const newPath = path.join(uploadsDir, newFilename);

  //  Save new file
  try {
    await access(oldPath);
    await rename(oldPath, newPath);
  } catch (err) {
    console.error("Failed to rename photo:", err);
    return null;
  }

  //  Cleanup old files
  try {
    await access(uploadsDir); // ensure uploads dir exists
    const files = await readdir(uploadsDir);

    let oldFilesToDelete = [];

    if (photoType === "event" && eventId) {
      oldFilesToDelete = files.filter(
        (file) =>
          file.startsWith(`event-${eventId}-${userId}-`) && file !== newFilename
      );
    } else if (photoType === "profile") {
      oldFilesToDelete = files.filter(
        (file) => file.startsWith(`user-${userId}-`) && file !== newFilename
      );
    }

    for (const file of oldFilesToDelete) {
      const filePath = path.join(uploadsDir, file);
      try {
        await access(filePath);
        await unlink(filePath);
      } catch (err) {
        // continue on error
      }
    }

    // Optional: Delete explicitly referenced old image
    if (currentPhotoUrl) {
      const urlParts = currentPhotoUrl.split("/");
      const currentFilename = urlParts[urlParts.length - 1];
      const shouldDelete =
        (photoType === "event" &&
          currentFilename.startsWith(`event-${eventId}-${userId}-`)) ||
        (photoType !== "event" &&
          currentFilename.startsWith(`user-${userId}-`));
      if (shouldDelete && currentFilename !== newFilename) {
        const currentPhotoPath = path.join(uploadsDir, currentFilename);
        try {
          await access(currentPhotoPath);
          await unlink(currentPhotoPath);
        } catch (err) {
          // skip if already gone
        }
      }
    }
  } catch (err) {
    console.error("Photo cleanup error:", err);
  }

  return `${process.env.BACKEND_URL}/uploads/${newFilename}`;
};

export const updateEventImage = async (eventId, imageUrl) => {
  await prisma.event.update({
    where: { id: eventId },
    data: { imageUrl },
  });
};

export const deletePhotoById = async (photoId) => {
  try {
    const photoRecord = await prisma.event.findUnique({
      where: { id: photoId },
      select: { imageUrl: true },
    });

    if (!photoRecord || !photoRecord.imageUrl) {
      console.warn("No photo found for ID:", photoId);
      return { success: false, message: "Photo not found in database." };
    }

    const imageUrl = photoRecord.imageUrl;
    const filename = imageUrl.split("/").pop();

    const photoPath = path.join(process.cwd(), "uploads", filename);

    try {
      await access(photoPath);
      await unlink(photoPath);
      console.log("Deleted file:", filename);
    } catch (err) {
      console.error("Error deleting file:", err.message);
      return { success: false, message: "File not found or already deleted." };
    }

    await prisma.event.update({
      where: { id: photoId },
      data: { imageUrl: null },
    });

    return { success: true, message: "Photo deleted successfully." };
  } catch (err) {
    console.error("Error deleting photo by ID:", err);
    return { success: false, message: "Internal error." };
  }
};
