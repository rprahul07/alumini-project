import path from "path";
import fs from "fs";
import { promisify } from "util";
import prisma from "../lib/prisma.js";

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);
const rename = promisify(fs.rename);
const mkdir = promisify(fs.mkdir);

export const handlePhotoUpload = async (
  req,
  currentPhotoUrl = null,
  photoType,
  eventId = null
) => {
  try {
    console.log("req.files =", req.files);

    // Get the photo file from various possible field names
    const photoFile =
      req.files?.photo?.[0] ||
      req.files?.profilePhoto?.[0] ||
      req.files?.eventPhoto?.[0];

    if (!photoFile) {
      console.warn("No photo file found in request");
      return null;
    }

    // Validate file type (optional - add your allowed types)
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

    // Determine upload directory and subdirectory
    const subDir = photoType === "event" ? "events" : "user";
    const uploadsDir = path.join(process.cwd(), "uploads", subDir);

    // Ensure upload directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create upload directory:", err);
      return null;
    }

    // Generate new filename
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

    // Save new file
    try {
      await access(oldPath);
      await rename(oldPath, newPath);
      console.log("File moved successfully:", newPath);
    } catch (err) {
      console.error("Failed to rename photo:", err);
      return null;
    }

    // Cleanup old files
    try {
      const files = await readdir(uploadsDir);
      let oldFilesToDelete = [];

      if (photoType === "event" && eventId) {
        oldFilesToDelete = files.filter(
          (file) =>
            file.startsWith(`event-${eventId}-${userId}-`) &&
            file !== newFilename
        );
      } else if (photoType === "profile") {
        oldFilesToDelete = files.filter(
          (file) => file.startsWith(`user-${userId}-`) && file !== newFilename
        );
      }

      // Delete old files
      for (const file of oldFilesToDelete) {
        const filePath = path.join(uploadsDir, file);
        try {
          await access(filePath);
          await unlink(filePath);
          console.log("Deleted old file:", file);
        } catch (err) {
          console.warn("Could not delete old file:", file, err.message);
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
            console.log("Deleted current photo:", currentFilename);
          } catch (err) {
            console.warn("Could not delete current photo:", currentFilename);
          }
        }
      }
    } catch (err) {
      console.error("Photo cleanup error:", err);
      // Continue execution - cleanup failure shouldn't prevent upload
    }

    // Return the correct URL with subdirectory
    const photoUrl = `${process.env.BACKEND_URL}/uploads/${subDir}/${newFilename}`;
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
    const photoRecord = await prisma.event.findUnique({
      where: { id: photoId },
      select: { imageUrl: true },
    });

    if (!photoRecord || !photoRecord.imageUrl) {
      console.warn("No photo found for ID:", photoId);
      return { success: false, message: "Photo not found in database." };
    }

    const imageUrl = photoRecord.imageUrl;

    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];
    const subDir = urlParts[urlParts.length - 2]; // Should be 'events' or 'user'

    // Validate subdirectory
    if (!["events", "user"].includes(subDir)) {
      console.error("Invalid subdirectory in URL:", subDir);
      return { success: false, message: "Invalid photo URL format." };
    }

    const photoPath = path.join(process.cwd(), "uploads", subDir, filename);

    // Delete the physical file
    try {
      await access(photoPath);
      await unlink(photoPath);
      console.log("Deleted file:", photoPath);
    } catch (err) {
      console.error("Error deleting file:", err.message);
      return { success: false, message: "File not found or already deleted." };
    }

    // Update database to remove the URL
    await prisma.event.update({
      where: { id: photoId },
      data: { imageUrl: null },
    });

    console.log("Photo deleted successfully for event:", photoId);
    return { success: true, message: "Photo deleted successfully." };
  } catch (err) {
    console.error("Error deleting photo by ID:", err);
    return { success: false, message: "Internal error occurred." };
  }
};
