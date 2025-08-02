import prisma from '../../lib/prisma.js';
import { createResponse, handleError } from '../../lib/error.js';

export const createContactUs = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await prisma.contactUs.create({
      data: { name, email, subject, message },
    });

    res.status(201).json(createResponse(true, "Contact message sent", contact));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAllContactUs = async (req, res) => {
  try {
    const messages = await prisma.contactUs.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(createResponse(true, "Contact messages fetched", messages));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contactUs.delete({ where: { id: Number(id) } });
    res.json(createResponse(true, "Contact message deleted"));
  } catch (error) {
    handleError(error, req, res);
  }
};
