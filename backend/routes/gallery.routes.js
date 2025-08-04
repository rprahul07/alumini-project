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


const router = express.Router();

router.use(protect);


// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Create a new gallery item with photo upload
router.post('/', upload.single('photo'), createGallery);

// Get all gallery items
router.get('/', getAllGallery);

// Update a gallery item with optional photo upload
router.put('/:id', upload.single('photo'), updateGallery);

// Delete a gallery item
router.delete('/:id', deleteGallery);

export default router;
