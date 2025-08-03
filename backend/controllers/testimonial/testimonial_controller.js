import prisma from '../../lib/prisma.js';
import { createResponse, handleError } from '../../lib/error.js';

// Admin-only: Create a testimonial
export const createTestimonial = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(createResponse(false, "Unauthorized"));
  }

  try {
    const { content,userId } = req.body;
    const user = await prisma.User.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    const testimonial = await prisma.Testimonial.create({
      data: {
        content,
        userId,
      },
    });

    res.status(201).json(createResponse(true, "Testimonial created successfully", testimonial));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Admin-only: Get all testimonials
export const getAllTestimonials = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(createResponse(false, "Unauthorized"));
  }

  try {
    const testimonials = await prisma.Testimonial.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(createResponse(true, "Testimonials fetched", testimonials));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Admin-only: Get testimonial by ID
export const getTestimonialById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(createResponse(false, "Unauthorized"));
  }

  try {
    const { id } = req.params;

    const testimonial = await prisma.Testimonial.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!testimonial) {
      return res.status(404).json(createResponse(false, "Testimonial not found"));
    }

    res.status(200).json(createResponse(true, "Testimonial fetched", testimonial));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Admin-only: Update testimonial
export const updateTestimonial = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(createResponse(false, "Unauthorized"));
  }

  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const existing = await prisma.Testimonial.findUnique({ where: { id: Number(id) } });

    if (!existing) {
      return res.status(404).json(createResponse(false, "Testimonial not found"));
    }

    

    const updated = await prisma.Testimonial.update({
      where: { id: Number(id) },
      data: { content: content ?? existing.content },
    });

    res.status(200).json(createResponse(true, "Testimonial updated", updated));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Admin-only: Delete testimonial
export const deleteTestimonial = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(createResponse(false, "Unauthorized"));
  }

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const testimonial = await prisma.Testimonial.findUnique({ where: { id: Number(id) } });

    if (!testimonial) {
      return res.status(404).json(createResponse(false, "Testimonial not found"));
    }

   

    await prisma.Testimonial.delete({ where: { id: Number(id) } });

    res.status(200).json(createResponse(true, "Testimonial deleted successfully"));
  } catch (error) {
    handleError(error, req, res);
  }
};
