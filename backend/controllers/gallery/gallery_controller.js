import prisma from '../../lib/prisma.js';
import { createResponse, handleError } from '../../lib/error.js';
import { handlePhotoUpload } from '../../utils/handlePhotoUpload.utils.js';

export const createGallery = async (req, res) => {
  try {
    const { title, description, redirectionUrl } = req.body;
    
    // Handle photo upload
    const imageUrl = await handlePhotoUpload(
      req,
      null,
      'gallery'
    );

    if (!imageUrl) {
      return res.status(400).json(createResponse(false, "Image upload failed"));
    }

    const gallery = await prisma.gallery.create({
      data: { 
        title, 
        description, 
        redirectionUrl, 
        imageUrl 
      },
    });

    res.status(201).json(createResponse(true, "Gallery item created", gallery));
  } catch (error) {
    console.error('Error in createGallery:', error);
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
    const { title, description, redirectionUrl } = req.body;
    
    // Get existing gallery item
    const existingItem = await prisma.gallery.findUnique({
      where: { id: Number(id) }
    });

    if (!existingItem) {
      return res.status(404).json(createResponse(false, "Gallery item not found"));
    }

    // Handle photo upload if new image is provided
    let imageUrl = existingItem.imageUrl;
    if (req.files?.photo?.[0]) {
      // Delete old image if exists
      if (existingItem.imageUrl) {
        try {
          const url = new URL(existingItem.imageUrl);
          const blobName = url.pathname.split('/').pop();
          const blobClient = containerClient.getBlobClient(blobName);
          await blobClient.deleteIfExists();
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      // Upload new image
      imageUrl = await handlePhotoUpload(req, null, 'gallery');
      if (!imageUrl) {
        return res.status(400).json(createResponse(false, "Image upload failed"));
      }
    }

    const updated = await prisma.gallery.update({
      where: { id: Number(id) },
      data: { 
        title, 
        description, 
        redirectionUrl, 
        imageUrl 
      },
    });

    res.json(createResponse(true, "Gallery updated", updated));
  } catch (error) {
    console.error('Error in updateGallery:', error);
    handleError(error, req, res);
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the gallery item first to get the image URL
    const galleryItem = await prisma.gallery.findUnique({
      where: { id: Number(id) }
    });

    if (!galleryItem) {
      return res.status(404).json(createResponse(false, "Gallery item not found"));
    }

    // Delete the image from blob storage if it exists
    if (galleryItem.imageUrl) {
      try {
        const url = new URL(galleryItem.imageUrl);
        const blobName = url.pathname.split('/').pop();
        const blobClient = containerClient.getBlobClient(blobName);
        await blobClient.deleteIfExists();
      } catch (error) {
        console.error('Error deleting image from blob storage:', error);
      }
    }

    // Delete the gallery item from the database
    await prisma.gallery.delete({ where: { id: Number(id) } });
    
    res.json(createResponse(true, "Gallery item deleted"));
  } catch (error) {
    console.error('Error in deleteGallery:', error);
    handleError(error, req, res);
  }
};
