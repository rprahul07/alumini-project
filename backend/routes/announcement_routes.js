import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcements/announcements.js';

const announcementRouter = express.Router();

// POST /api/announcements - Create a new announcement
announcementRouter.post('/', createAnnouncement);

// GET /api/announcements - Get all announcements
announcementRouter.get('/', getAllAnnouncements);

// PUT /api/announcements/:id - Update an announcement
announcementRouter.put('/:id', updateAnnouncement);

// DELETE /api/announcements/:id - Delete an announcement
announcementRouter.delete('/:id', deleteAnnouncement);

export default announcementRouter;
