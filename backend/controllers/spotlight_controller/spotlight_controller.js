import prisma from "../../lib/prisma.js";

// 🌐 Public - GET all
export const getAllSpotlights = async (req, res) => {
  try {
    const spotlights = await prisma.spotlight.findMany();
    res.status(200).json({ data: spotlights });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spotlights" });
  }
};

// 🌐 Public - GET one
export const getSpotlightById = async (req, res) => {
  try {
    const spotlight = await prisma.spotlight.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!spotlight) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ data: spotlight });
  } catch (err) {
    res.status(500).json({ error: "Error fetching spotlight" });
  }
};

// 🔐 Admin - CREATE
export const createSpotlight = async (req, res) => {
  try {
    const { title, description, redirectionUrl } = req.body;

    const newSpotlight = await prisma.spotlight.create({
      data: {
        title,
        description,
        redirectionUrl,
        userId: req.user.id,
      },
    });

    res.status(201).json({ data: newSpotlight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating spotlight" });
  }
};

// 🔐 Admin - UPDATE
export const updateSpotlight = async (req, res) => {
  try {
    const spotlight = await prisma.spotlight.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    res.status(200).json({ data: spotlight });
  } catch (err) {
    res.status(500).json({ error: "Error updating spotlight" });
  }
};

// 🔐 Admin - DELETE
export const deleteSpotlight = async (req, res) => {
  try {
    await prisma.spotlight.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error deleting spotlight" });
  }
};
