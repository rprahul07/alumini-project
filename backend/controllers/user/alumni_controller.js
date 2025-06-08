import { ROLES } from "../../constants/user_constants.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../services/user_service.js";

export const createAlumni = async (userData) => {
  const {
    graduationYear,
    course,
    currentJobTitle,
    companyName,
    fullName,
    email,
    password,
    phoneNumber,
    department,
  } = userData;

  const hashedPassword = await hashPassword(password);
  // Create user and alumni records in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the main user record
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        department,
        role: ROLES.ALUMNI,
      },
    });

    // Create the alumni-specific record
    const newAlumni = await tx.alumni.create({
      data: {
        graduationYear: parseInt(graduationYear),
        course,
        currentJobTitle,
        companyName,
        userId: newUser.id,
      },
    });

    return {
      user: newUser,
      alumni: newAlumni,
    };
  });

  return result;
};

export const registerAlumni = async (req, res) => {
  try {
    const { user, alumni } = await createAlumni(req.body);

    // Generate token using the user ID
    generateTokenAndSetCookie(user.id, ROLES.ALUMNI, res);

    res.status(201).json(
      createResponse(true, "Alumni registered successfully", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        alumniDetails: {
          graduationYear: alumni.graduationYear,
          course: alumni.course,
          currentJobTitle: alumni.currentJobTitle,
          companyName: alumni.companyName,
        },
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        department: true,
        role: true,
        photoUrl: true,
        alumni: {
          select: {
            id: true,
            graduationYear: true,
            course: true,
            currentJobTitle: true,
            companyName: true,
          },
        },
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has alumni role
    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching alumni by ID:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAllAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {
      role: ROLES.ALUMNI,
      ...(department && { department }),
    };

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereClause,
    });

    // Get alumni data
    const alumni = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        createdAt: true,
        photoUrl: true,
        alumni: {
          select: {
            id: true,
            graduationYear: true,
            course: true,
            currentJobTitle: true,
            companyName: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const response = {
      alumni,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1,
      },
    };

    res
      .status(200)
      .json(createResponse(true, "Alumni retrieved successfully", response));
  } catch (error) {
    console.error("Error fetching all alumni:", error);
    handleError(error, req, res);
  }
};

export const deleteAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Check if user exists and is an alumni
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        alumni: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    if (user.role !== "alumni") {
      return res.status(400).json({
        success: false,
        message: "User is not an alumni",
      });
    }

    // Delete alumni record first, then user record using transaction
    await prisma.$transaction([
      prisma.alumni.delete({
        where: { userId: userIdInt },
      }),
      prisma.user.delete({
        where: { id: userIdInt },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Alumni deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alumni by ID:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fullName,
      email,
      phoneNumber,
      department,
      photoUrl,
      graduationYear,
      course,
      currentJobTitle,
      companyName,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Check if user exists and is an alumni
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        alumni: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    if (user.role !== "alumni") {
      return res.status(400).json({
        success: false,
        message: "User is not an alumni",
      });
    }

    // Prepare update data for User table
    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (photoUrl !== undefined) userUpdateData.photoUrl = photoUrl;

    // Prepare update data for Alumni table
    const alumniUpdateData = {};
    if (graduationYear !== undefined) {
      const graduationYearInt = parseInt(graduationYear);
      if (isNaN(graduationYearInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid graduation year format",
        });
      }
      alumniUpdateData.graduationYear = graduationYearInt;
    }
    if (course !== undefined) alumniUpdateData.course = course;
    if (currentJobTitle !== undefined)
      alumniUpdateData.currentJobTitle = currentJobTitle;
    if (companyName !== undefined) alumniUpdateData.companyName = companyName;

    // Update both User and Alumni records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      let updatedUser = user;
      if (Object.keys(userUpdateData).length > 0) {
        updatedUser = await prisma.user.update({
          where: { id: userIdInt },
          data: userUpdateData,
        });
      }

      // Update Alumni record if there's data to update
      let updatedAlumni = user.alumni;
      if (Object.keys(alumniUpdateData).length > 0) {
        updatedAlumni = await prisma.alumni.update({
          where: { userId: userIdInt },
          data: alumniUpdateData,
        });
      }

      // Fetch the complete updated record
      return await prisma.user.findUnique({
        where: { id: userIdInt },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          department: true,
          role: true,
          photoUrl: true,
          alumni: {
            select: {
              id: true,
              graduationYear: true,
              course: true,
              currentJobTitle: true,
              companyName: true,
            },
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Alumni updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating alumni by ID:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
