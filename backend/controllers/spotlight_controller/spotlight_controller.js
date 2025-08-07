import prisma from "../../lib/prisma.js";

// 🌐 Public - GET all spotlights with user data
export const getAllSpotlights = async (req, res) => {
  try {
    const spotlights = await prisma.spotlight.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            alumni: {
              select: {
                graduationYear: true,
                currentJobTitle: true,
                companyName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json({ 
      success: true,
      data: spotlights 
    });
  } catch (err) {
    console.error('Error fetching spotlights:', err);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch spotlights" 
    });
  }
};

// 🌐 Public - GET one spotlight with user data
export const getSpotlightById = async (req, res) => {
  try {
    const spotlight = await prisma.spotlight.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            alumni: {
              select: {
                graduationYear: true,
                currentJobTitle: true,
                companyName: true
              }
            }
          }
        }
      }
    });
    
    if (!spotlight) {
      return res.status(404).json({ 
        success: false,
        error: "Spotlight not found" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      data: spotlight 
    });
  } catch (err) {
    console.error('Error fetching spotlight:', err);
    res.status(500).json({ 
      success: false,
      error: "Error fetching spotlight" 
    });
  }
};

// 🔐 Admin - CREATE spotlight
export const createSpotlight = async (req, res) => {
  try {
    const { title, description, redirectionUrl, userId } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Title is required" 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: "Alumni selection is required" 
      });
    }

    // Verify the user exists and is an alumni
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        alumni: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Selected user not found" 
      });
    }

    if (!user.alumni) {
      return res.status(400).json({ 
        success: false,
        error: "Selected user is not an alumni" 
      });
    }

    const newSpotlight = await prisma.spotlight.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        redirectionUrl: redirectionUrl?.trim() || null,
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            alumni: {
              select: {
                graduationYear: true,
                currentJobTitle: true,
                companyName: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ 
      success: true,
      data: newSpotlight 
    });
  } catch (err) {
    console.error('Error creating spotlight:', err);
    res.status(500).json({ 
      success: false,
      error: "Error creating spotlight" 
    });
  }
};

// 🔐 Admin - UPDATE spotlight
export const updateSpotlight = async (req, res) => {
  try {
    const { title, description, redirectionUrl, userId } = req.body;
    const spotlightId = parseInt(req.params.id);

    // Check if spotlight exists
    const existingSpotlight = await prisma.spotlight.findUnique({
      where: { id: spotlightId }
    });

    if (!existingSpotlight) {
      return res.status(404).json({ 
        success: false,
        error: "Spotlight not found" 
      });
    }

    // Prepare update data
    const updateData = {};
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: "Title cannot be empty" 
        });
      }
      updateData.title = title.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    
    if (redirectionUrl !== undefined) {
      updateData.redirectionUrl = redirectionUrl?.trim() || null;
    }

    if (userId !== undefined) {
      // Verify the new user exists and is an alumni
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { alumni: true }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: "Selected user not found" 
        });
      }

      if (!user.alumni) {
        return res.status(400).json({ 
          success: false,
          error: "Selected user is not an alumni" 
        });
      }

      updateData.userId = parseInt(userId);
    }

    const spotlight = await prisma.spotlight.update({
      where: { id: spotlightId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            alumni: {
              select: {
                graduationYear: true,
                currentJobTitle: true,
                companyName: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({ 
      success: true,
      data: spotlight 
    });
  } catch (err) {
    console.error('Error updating spotlight:', err);
    res.status(500).json({ 
      success: false,
      error: "Error updating spotlight" 
    });
  }
};

// 🔐 Admin - DELETE spotlight
export const deleteSpotlight = async (req, res) => {
  try {
    const spotlightId = parseInt(req.params.id);

    // Check if spotlight exists
    const existingSpotlight = await prisma.spotlight.findUnique({
      where: { id: spotlightId }
    });

    if (!existingSpotlight) {
      return res.status(404).json({ 
        success: false,
        error: "Spotlight not found" 
      });
    }

    await prisma.spotlight.delete({
      where: { id: spotlightId },
    });

    res.status(200).json({ 
      success: true,
      message: "Spotlight deleted successfully" 
    });
  } catch (err) {
    console.error('Error deleting spotlight:', err);
    res.status(500).json({ 
      success: false,
      error: "Error deleting spotlight" 
    });
  }
};
