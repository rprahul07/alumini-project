import { ROLES } from "../../constants/user_constants.js";
import {
  AppError,
  createResponse,
  handleError,
} from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";

import prisma from "../../lib/prisma.js";
import {
  checkEmailExists,
  hashPassword,
  validatePassword,
  validateUserData,
} from "../../services/user_service.js";
import multer from "multer";
import { handlePhotoUpload } from "../../utils/handlePhotoUpload.utils.js";

export const createStudent = async (userData) => {
  const {
    currentSemester,
    rollNumber,
    fullName,
    email,
    password,
    phoneNumber,
    department,
  } = userData;

  // Hash the password
  const hashedPassword = await hashPassword(password);

  const newStudent = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      department,
      role: ROLES.STUDENT,
      student: {
        create: {
          currentSemester,
          rollNumber,
        },
      },
    },
    include: {
      student: true,
    },
  });

  return newStudent;
};

export const registerStudent = async (req, res) => {
  try {
    const { password, confirmPassword, role } = req.body;

    if (!role) {
      throw new AppError("Role is required", 400);
    }

    if (!Object.values(ROLES).includes(role.toLowerCase())) {
      throw new AppError("Invalid role specified", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords don't match", 400);
    }

    console.log("Validating password...");
    validatePassword(password);

    console.log("Validating user data...");
    validateUserData(req.body, role);

    console.log("Checking if email exists...");
    if (await checkEmailExists(req.body.email)) {
      throw new AppError("Email already exists", 409);
    }

    console.log("Creating user...");
    const newStudent = await createStudent(req.body);
    generateTokenAndSetCookie(newStudent.id, ROLES.STUDENT, res);

    res.status(201).json(
      createResponse(true, "Student registered successfully", {
        _id: newStudent.id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        phoneNumber: newStudent.phoneNumber,
        department: newStudent.department,
        role: newStudent.role,
        student: {
          currentSemester: newStudent.student.currentSemester,
          rollNumber: newStudent.student.rollNumber,
        },
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getStudentById = async (req, res) => {
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
        message: "Invalid user ID",
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
        bio: true,
        linkedinUrl: true,
        student: {
          select: {
            id: true,
            currentSemester: true,
            rollNumber: true,
            graduationYear: true,
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

    if (!user.student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {
      role: ROLES.STUDENT,
      ...(department && { department }),
    };

    const totalCount = await prisma.user.count({
      where: whereClause,
    });

    const students = await prisma.user.findMany({
      where: whereClause,
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
        student: {
          select: {
            id: true,
            currentSemester: true,
            rollNumber: true,
            graduationYear: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    // Add userId property
    const studentsWithUserId = students.map(s => ({ ...s, userId: s.id }));

    const response = {
      students: studentsWithUserId,
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
      .json(createResponse(true, "Students retrieved successfully", response));
  } catch (error) {
    console.error("Error fetching all students:", error);
    handleError(error, req, res);
  }
};

export const deleteStudentById = async (req, res) => {
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
        message: "Invalid user ID",
      });
    }

    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        student: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found for this user",
      });
    }

    if (user.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "User is not a student",
      });
    }

    // Delete student record first, then user record using transaction
    await prisma.$transaction([
      prisma.student.delete({
        where: { userId: userIdInt },
      }),
      prisma.user.delete({
        where: { id: userIdInt },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student by ID:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateStudentById = async (req, res) => {
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
        message: "Invalid user ID",
      });
    }

    const {
      fullName,
      email,
      phoneNumber,
      department,
      bio,
      linkedinUrl,
      twitterUrl,
      githubUrl,
      currentSemester,
      rollNumber,
      graduationYear,
    } = req.body;

    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        student: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found for this user",
      });
    }

    if (user.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "User is not a student",
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

    // Prepare update data for Student table
    const studentUpdateData = {};
    if (currentSemester !== undefined) {
      const currentSemesterInt = parseInt(currentSemester);
      if (isNaN(currentSemesterInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid current semester format",
        });
      }
      studentUpdateData.currentSemester = currentSemesterInt;
    }
    if (rollNumber !== undefined) studentUpdateData.rollNumber = rollNumber;
    if (graduationYear !== undefined) {
      const graduationYearInt = parseInt(graduationYear);
      if (isNaN(graduationYearInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid graduation year format",
        });
      }
      studentUpdateData.graduationYear = graduationYearInt;
    }

    // Update both User and Student records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userIdInt },
          data: userUpdateData,
        });
      }

      // Update Student record if there's data to update
      if (Object.keys(studentUpdateData).length > 0) {
        await prisma.student.update({
          where: { userId: userIdInt },
          data: studentUpdateData,
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
          bio: true,
          linkedinUrl: true,
          twitterUrl: true,
          githubUrl: true,
          student: {
            select: {
              id: true,
              currentSemester: true,
              rollNumber: true,
              graduationYear: true,
            },
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating student by ID:", error);

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
        message: "Email or roll number already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(500).json({
      success: true,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateMyStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      email,
      phoneNumber,
      department,
      bio,
      linkedinUrl,
      twitterUrl,
      githubUrl,
      currentSemester,
      rollNumber,
      graduationYear,
    } = req.body;

    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found for this user",
      });
    }

    if (user.role !== ROLES.STUDENT) {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this profile",
      });
    }

    // Handle photo upload
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
    if (twitterUrl !== undefined) userUpdateData.twitterUrl = twitterUrl;
    if (githubUrl !== undefined) userUpdateData.githubUrl = githubUrl;

    // Prepare update data for Student table
    const studentUpdateData = {};
    if (currentSemester !== undefined) {
      const semesterInt = parseInt(currentSemester);
      if (isNaN(semesterInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid current semester format",
        });
      }
      studentUpdateData.currentSemester = semesterInt;
    }
    if (rollNumber !== undefined) studentUpdateData.rollNumber = rollNumber;
    if (graduationYear !== undefined) {
      const yearInt = parseInt(graduationYear);
      if (isNaN(yearInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid graduation year format",
        });
      }
      studentUpdateData.graduationYear = yearInt;
    }

    // Update both User and Student records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // Update Student record if there's data to update
      if (Object.keys(studentUpdateData).length > 0) {
        await prisma.student.update({
          where: { userId },
          data: studentUpdateData,
        });
      }

      // Fetch the complete updated record
      return await prisma.user.findUnique({
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
          twitterUrl: true,
          githubUrl: true,
          student: {
            select: {
              id: true,
              currentSemester: true,
              rollNumber: true,
              graduationYear: true,
            },
          },
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);

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
        message: "Email or roll number already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMyStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting profile for user ID:', userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true
      }
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format the response to include all necessary fields
    const profileData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      photoUrl: user.photoUrl,
      bio: user.bio,
      department: user.department,
      linkedinUrl: user.linkedinUrl,
      twitterUrl: user.twitterUrl,
      githubUrl: user.githubUrl,
      student: user.student ? {
        currentSemester: user.student.currentSemester,
        rollNumber: user.student.rollNumber,
        graduationYear: user.student.graduationYear
      } : null
    };

    console.log('Sending profile data:', profileData);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profileData
    });
  } catch (error) {
    console.error('Error in getMyStudentProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's photoUrl to null
    await prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null },
    });

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    handleError(error, req, res);
  }
};