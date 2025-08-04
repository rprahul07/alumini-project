import multer from "multer";

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

// Use memory storage since we're uploading directly to Azure Blob
const storage = multer.memoryStorage();

export const uploadPhotoMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Limit to 1 file per request
  }
}).fields([
  { name: "photo", maxCount: 1 }, // User profile photo
  { name: "eventPhoto", maxCount: 1 }, // Event photo
]);
