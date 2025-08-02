import prisma from '../../lib/prisma.js';
import { createResponse, handleError } from '../../lib/error.js';

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, order } = req.body;

    const announcement = await prisma.announcement.create({
      data: { title, content, order },
    });

    res.status(201).json(createResponse(true, "Announcement created", announcement));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(createResponse(true, "Announcements fetched", announcements));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order } = req.body;

    const updated = await prisma.announcement.update({
      where: { id: Number(id) },
      data: { title, content, order },
    });

    res.json(createResponse(true, "Announcement updated", updated));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.announcement.delete({ where: { id: Number(id) } });
    res.json(createResponse(true, "Announcement deleted"));
  } catch (error) {
    handleError(error, req, res);
  }
};
