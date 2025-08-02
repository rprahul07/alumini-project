// routes/gallery.routes.js
import express from 'express';
import {
  createGallery,
  getAllGallery,
  updateGallery,
  deleteGallery
} from '../controllers/gallery/gallery_controller.js';

const galleryRouter = express.Router();

galleryRouter.post('/', createGallery);
galleryRouter.get('/', getAllGallery);
galleryRouter.put('/:id', updateGallery);
galleryRouter.delete('/:id', deleteGallery);

export default galleryRouter;
