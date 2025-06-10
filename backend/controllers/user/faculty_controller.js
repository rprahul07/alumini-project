import { ROLES } from "../../constants/user_constants.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../services/user_service.js";
import { handlePhotoUpload } from "../../utils/handlePhotoUpload.utils.js";
import multer from "multer";

export const createFaculty = async (userData) => {
  const { designation, fullName, email, password, phoneNumber, department } =
    userData;

  // Add validation
  if (!fullName || !email || !password || !designation) {
    throw new Error(
      "Required fields missing: fullName, email, password, designation"
    );
  }
  const hashedPassword = await hashPassword(password);

  // Create user and faculty records in a transaction
  const result = await prisma.$transaction(async (tx) => {
    try {
      // Create the main user record
      const newUser = await tx.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          phoneNumber,
          department,
          role: ROLES.FACULTY,
        },
      });

      console.log("Created user:", newUser); // Debug log

      // Create the faculty-specific record
      const newFaculty = await tx.faculty.create({
        data: {
          designation,
          userId: newUser.id,
        },
      });

      console.log("Created faculty:", newFaculty); // Debug log

      return {
        user: newUser,
        faculty: newFaculty,
      };
    } catch (transactionError) {
      console.error("Transaction error:", transactionError);
      throw transactionError;
    }
  });

  return result;
};

export const registerFaculty = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log

    const { user, faculty } = await createFaculty(req.body);

    generateTokenAndSetCookie(user.id, ROLES.FACULTY, res);

    res.status(201).json(
      createResponse(true, "Faculty registered successfully", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        facultyDetails: {
          designation: faculty.designation,
        },
      })
    );
  } catch (error) {
    console.error("REGISTER_FACULTY - Registration error:", error);
    handleError(error, req, res);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(req.query.userId);
    if (isNaN(userIdInt)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
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
        faculty: {
          select: {
            id: true,
            designation: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {
      role: ROLES.FACULTY,
      ...(department && { department }),
    };

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereClause,
    });

    // Get faculty data
    const faculty = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        createdAt: true,
        photoUrl: true,
        faculty: {
          select: {
            id: true,
            designation: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const response = {
      faculty,
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
      .json(createResponse(true, "Faculty retrieved successfully", response));
  } catch (error) {
    console.error("Error fetching all faculty:", error);
    handleError(error, req, res);
  }
};

export const deleteFacultyById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(req.query.userId);
    if (isNaN(userIdInt)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }
    // Check if user exists and is a faculty
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        faculty: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found for this user",
      });
    }

    if (user.role !== "faculty") {
      return res.status(400).json({
        success: false,
        message: "User is not a faculty",
      });
    }

    // Delete faculty record first, then user record using transaction
    await prisma.$transaction([
      prisma.faculty.delete({
        where: { userId: userIdInt },
      }),
      prisma.user.delete({
        where: { id: userIdInt },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting faculty by ID:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateFacultyById = async (req, res) => {
  try {
    const userId = req.query.userId;

    const {
      fullName,
      email,
      phoneNumber,
      department,
      bio,
      linkedinUrl,
      designation,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Check if user exists and is a faculty
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        faculty: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found for this user",
      });
    }

    if (user.role !== "faculty") {
      return res.status(400).json({
        success: false,
        message: "User is not a faculty member",
      });
    }

    const newPhotoUrl = await handlePhotoUpload(req, user.photoUrl);

    // Prepare update data for User table
    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (linkedinUrl !== undefined) userUpdateData.linkedinUrl = linkedinUrl;
    if (newPhotoUrl) userUpdateData.photoUrl = newPhotoUrl;

    // Prepare update data for Faculty table
    const facultyUpdateData = {};
    if (designation !== undefined) facultyUpdateData.designation = designation;

    // Update both User and Faculty records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userIdInt },
          data: userUpdateData,
        });
      }

      // Update Faculty record if there's data to update
      if (Object.keys(facultyUpdateData).length > 0) {
        await prisma.faculty.update({
          where: { userId: userIdInt },
          data: facultyUpdateData,
        });
      }

      // Fetch the complete updated record
      const finalResult = await prisma.user.findUnique({
        where: { id: userIdInt },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          department: true,
          role: true,
          photoUrl: true,
          bio: true,
          linkedinUrl: true,
          faculty: {
            select: {
              id: true,
              designation: true,
            },
          },
        },
      });

      return finalResult;
    });

    return res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating faculty by ID:", error);

    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB",
        });
      }
      return res.status(400).json({
        success: false,
        message: "File upload error",
      });
    }

    // Handle file type error
    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (JPEG, PNG, GIF, WebP)",
      });
    }

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
        message: "Faculty not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateMyFacultyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      email,
      phoneNumber,
      department,
      bio,
      linkedinUrl,
      designation,
    } = req.body;

    // Check if user exists and is a faculty
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        faculty: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found for this user",
      });
    }

    if (user.role !== ROLES.FACULTY) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this profile",
      });
    }

    const newPhotoUrl = await handlePhotoUpload(req, user.photoUrl);

    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (linkedinUrl !== undefined) userUpdateData.linkedinUrl = linkedinUrl;
    if (newPhotoUrl) userUpdateData.photoUrl = newPhotoUrl;

    const facultyUpdateData = {};
    if (designation !== undefined) facultyUpdateData.designation = designation;

    const updated = await prisma.$transaction(async (prisma) => {
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      if (Object.keys(facultyUpdateData).length > 0) {
        await prisma.faculty.update({
          where: { userId },
          data: facultyUpdateData,
        });
      }

      const final = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          department: true,
          role: true,
          photoUrl: true,
          bio: true,
          linkedinUrl: true,
          faculty: {
            select: {
              id: true,
              designation: true,
            },
          },
        },
      });

      return final;
    });

    return res.status(200).json({
      success: true,
      message: "Faculty profile updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating faculty profile:", error);

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Max is 5MB",
      });
    }

    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (JPEG, PNG, GIF, WebP)",
      });
    }

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

