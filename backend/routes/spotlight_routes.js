import express from 'express';
import {
  getAllSpotlights,
  getSpotlightById,
  createSpotlight,
  updateSpotlight,
  deleteSpotlight
} from '../controllers/spotlight_controller/spotlight_controller.js';

import {protect} from '../middleware/jwt_middleware.js';
import {isAdmin} from '../middleware/role_middleware.js';
const spotlightRouter = express.Router();

// Public routes
spotlightRouter.get('/', getAllSpotlights);
spotlightRouter.get('/:id', getSpotlightById);

// Admin routes - protected with both authentication and admin role
spotlightRouter.post('/', protect, isAdmin, createSpotlight);
spotlightRouter.put('/:id', protect, isAdmin, updateSpotlight);
spotlightRouter.delete('/:id', protect, isAdmin, deleteSpotlight);

export default spotlightRouter;
