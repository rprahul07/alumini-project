import path from "path";
import fs from "fs";

export const handlePhotoUpload = async (req, currentPhotoUrl = null) => {
  // Check for photo in either field
  const photoFile = req.files?.photo?.[0] || req.files?.profilePhoto?.[0];
  
  if (!photoFile) {
    return null;
  }

  const userId = req.user?.id;
  const newFilename = photoFile.filename;

  // Delete all existing photos for this user EXCEPT the new one
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Check if uploads directory exists
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);

      // Find existing photos for this user, excluding the new one
      const userPhotos = files.filter(
        (file) => file.startsWith(`user-${userId}-`) && file !== newFilename
      );

      userPhotos.forEach((photo) => {
        const photoPath = path.join(uploadsDir, photo);
        try {
          fs.unlinkSync(photoPath);
          console.log(`Deleted old user photo: ${photo}`);
        } catch (err) {
          console.warn(`Could not delete old photo ${photo}:`, err.message);
        }
      });
    }
  } catch (err) {
    console.warn("Could not delete old photos:", err.message);
  }

  // Return full photo URL
  const port = process.env.PORT || 5001;
  return `http://localhost:${port}/uploads/${newFilename}`;
};
