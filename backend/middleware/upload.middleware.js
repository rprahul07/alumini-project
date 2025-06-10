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

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Get userId from request user object (set by auth middleware)
    const userId = req.user?.id;
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();

    // Create filename with userId: user-123-1749454738301.jpg
    const filename = `user-${userId}-${timestamp}${fileExtension}`;
    cb(null, filename);
  },
});

// Multer middleware - single export
export const uploadPhotoMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]);
