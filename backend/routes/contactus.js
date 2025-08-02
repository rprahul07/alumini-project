import express from 'express';
import {
  createContactUs,
  getAllContactUs,
  deleteContactUs
} from '../controllers/contactus/contactus_controller.js';

const contactusRouter = express.Router();

// POST /api/contact - Send a contact message
contactusRouter.post('/', createContactUs);

// GET /api/contact - Get all contact messages
contactusRouter.get('/', getAllContactUs);

// DELETE /api/contact/:id - Delete a contact message
contactusRouter.delete('/:id', deleteContactUs);

export default contactusRouter;
