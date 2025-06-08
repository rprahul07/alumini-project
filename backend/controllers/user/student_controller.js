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
        student: {
          select: {
            id: true,
            currentSemester: true,
            rollNumber: true,
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
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        createdAt: true,
        photoUrl: true,
        student: {
          select: {
            id: true,
            currentSemester: true,
            rollNumber: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const response = {
      students,
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
        message: "Invalid user ID format",
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
    const {
      fullName,
      email,
      phoneNumber,
      department,
      photoUrl,
      currentSemester,
      rollNumber,
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

    // Prepare update data for User table
    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (photoUrl !== undefined) userUpdateData.photoUrl = photoUrl;

    // Prepare update data for Student table
    const studentUpdateData = {};
    if (currentSemester !== undefined)
      studentUpdateData.currentSemester = currentSemester;
    if (rollNumber !== undefined) studentUpdateData.rollNumber = rollNumber;

    // Update both User and Student records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      let updatedUser = user;
      if (Object.keys(userUpdateData).length > 0) {
        updatedUser = await prisma.user.update({
          where: { id: userIdInt },
          data: userUpdateData,
        });
      }

      // Update Student record if there's data to update
      let updatedStudent = user.student;
      if (Object.keys(studentUpdateData).length > 0) {
        updatedStudent = await prisma.student.update({
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
          student: {
            select: {
              id: true,
              currentSemester: true,
              rollNumber: true,
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
