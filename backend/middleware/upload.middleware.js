import multer from "multer";
import path from "path";
import fs from "fs";

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, GIF, WebP)"), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user?.id;
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();

    // Different filename patterns based on field name
    let filename;
    if (file.fieldname === "eventPhoto") {
      // For events: event-userId-timestamp.jpg
      filename = `event-${userId}-${timestamp}${fileExtension}`;
    } else {
      // For user profiles: user-userId-timestamp.jpg (existing pattern)
      filename = `user-${userId}-${timestamp}${fileExtension}`;
    }

    cb(null, filename);
  },
});

export const uploadPhotoMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
}).fields([
  { name: "photo", maxCount: 1 }, // User profile photo
  { name: "profilePhoto", maxCount: 1 }, // Alternative user profile photo
  { name: "eventPhoto", maxCount: 1 }, // Event photo
]);
