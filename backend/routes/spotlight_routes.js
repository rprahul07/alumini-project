import express from 'express';
import {
  getAllSpotlights,
  getSpotlightById,
  createSpotlight,
  updateSpotlight,
  deleteSpotlight
} from '../controllers/spotlight_controller/spotlight_controller.js';

import {protect} from '../middleware/jwt_middleware.js';
const spotlightRouter = express.Router();

// Public routes
spotlightRouter.get('/', getAllSpotlights);
spotlightRouter.get('/:id', getSpotlightById);

// Admin routes
spotlightRouter.post('/', protect, createSpotlight);
spotlightRouter.put('/:id', protect, updateSpotlight);
spotlightRouter.delete('/:id', protect, deleteSpotlight);

export default spotlightRouter;
