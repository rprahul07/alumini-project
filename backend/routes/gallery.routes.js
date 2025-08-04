// routes/gallery.routes.js
import express from 'express';
import multer from 'multer';
import {
  createGallery,
  getAllGallery,
  updateGallery,
  deleteGallery
} from '../controllers/gallery/gallery_controller.js';
import { protect } from '../middleware/jwt_middleware.js';  
import { uploadPhotoMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(protect);

// Create a new gallery item with photo upload
router.post('/', 
  (req, res, next) => {
    uploadPhotoMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  createGallery
);

// Get all gallery items
router.get('/', getAllGallery);

// Update a gallery item with optional photo upload
router.put('/:id', 
  (req, res, next) => {
    uploadPhotoMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  updateGallery
);

// Delete a gallery item
router.delete('/:id', deleteGallery);

export default router;
