import prisma from '../../lib/prisma.js';
import { createResponse, handleError } from '../../lib/error.js';

export const createGallery = async (req, res) => {
  try {
    const { title, description, redirectionUrl, imageUrl } = req.body;

    const gallery = await prisma.gallery.create({
      data: { title, description, redirectionUrl, imageUrl },
    });

    res.status(201).json(createResponse(true, "Gallery item created", gallery));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAllGallery = async (req, res) => {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(createResponse(true, "Gallery fetched", gallery));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, redirectionUrl, imageUrl } = req.body;

    const updated = await prisma.gallery.update({
      where: { id: Number(id) },
      data: { title, description, redirectionUrl, imageUrl },
    });

    res.json(createResponse(true, "Gallery updated", updated));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.gallery.delete({ where: { id: Number(id) } });
    res.json(createResponse(true, "Gallery deleted"));
  } catch (error) {
    handleError(error, req, res);
  }
};
