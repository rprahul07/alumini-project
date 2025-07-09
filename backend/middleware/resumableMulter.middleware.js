import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // You might want to add more specific file type checks here
  // For now, allowing all file types for chunked uploads
  cb(null, true);
};

export const resumableMulter = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Example: 50MB limit per chunk, adjust as needed
  fileFilter: fileFilter,
}).fields([{ name: "chunk", maxCount: 1 }]);