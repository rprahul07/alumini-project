import { AppError } from "../../utils/response.utils.js";
import { ROLES } from "../../constants/user_constants.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import {
  validatePassword,
  validateUserData,
  checkEmailExists,
  findUserByRole,
  verifyPassword,
} from "../../services/user_service.js";
import { createStudent } from "./student_controller.js";
import { createAlumni } from "./alumni_controller.js";
import { createFaculty } from "./faculty_controller.js";

export const signup = async (req, res) => {
  try {
    // console.log('Registration request received:', {
    //   body: { ...req.body, password: '[REDACTED]' }
    // });

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
    let newUser;
    let additionalData = null;

    try {
      switch (role.toLowerCase()) {
        case ROLES.STUDENT:
          newUser = await createStudent(req.body);
          break;
        case ROLES.ALUMNI:
          const alumniResult = await createAlumni(req.body);
          newUser = alumniResult.user;
          additionalData = alumniResult.alumni;
          break;
        case ROLES.FACULTY:
          const facultyResult = await createFaculty(req.body);
          newUser = facultyResult.user;
          break;
        default:
          throw new AppError("Invalid role specified", 400);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    console.log("User created successfully:", {
      id: newUser.id,
      email: newUser.email,
      role,
    });

    generateTokenAndSetCookie(newUser.id, role, res);

    // Build response data
    const responseData = {
      _id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role,
    };

    // Add role-specific data if available
    if (role.toLowerCase() === ROLES.ALUMNI && additionalData) {
      responseData.alumniDetails = {
        graduationYear: additionalData.graduationYear,
        course: additionalData.course,
        currentJobTitle: additionalData.currentJobTitle,
        companyName: additionalData.companyName,
      };
    }

    res
      .status(201)
      .json(
        createResponse(true, `${role} registered successfully`, responseData)
      );
  } catch (error) {
    console.error("Registration error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    });
    handleError(error, req, res);
  }
};
// Login function for all roles
// This function checks the user's credentials and generates a JWT token if valid.
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new AppError("Please provide email, password and role", 400);
    }

    const user = await findUserByRole(email, role, {
      id: true,
      fullName: true,
      email: true,
      password: true,
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateTokenAndSetCookie(user.id, role, res);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role,
      }
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

// Logout function to clear the JWT cookie
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json(createResponse(true, "Logged out successfully"));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Check authentication status and return user details
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const user = await findUserByRole(req.user.id, req.user.role, {
      id: true,
      fullName: true,
      email: true,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(
      createResponse(true, "User authenticated", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: req.user.role,
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

// Get user profile based on role
// This function retrieves the user's profile information based on their role.
export const getUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    const user = await findUserByRole(id, role, {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      department: true,
      ...(role === "student" && {
        currentSemester: true,
        rollNumber: true,
      }),
      ...(role === "alumni" && {
        graduationYear: true,
        course: true,
        currentJobTitle: true,
        companyName: true,
      }),
      ...(role === "faculty" && {
        designation: true,
      }),
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(createResponse(true, "User profile retrieved successfully", user));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Update user profile based on role
// This function allows users to update their profile information, excluding sensitive fields like password and email.
export const updateUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { password, email, role: newRole, ...updateData } = req.body;

    // Prevent updating sensitive fields
    if (password) {
      throw new AppError("Cannot update password through this endpoint", 400);
    }
    if (email) {
      throw new AppError("Cannot update email through this endpoint", 400);
    }
    if (newRole) {
      throw new AppError("Cannot update role", 400);
    }

    const updatedUser = await findUserByRole(id, role, {
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        ...(role === "student" && {
          currentSemester: true,
          rollNumber: true,
        }),
        ...(role === "alumni" && {
          graduationYear: true,
          course: true,
          currentJobTitle: true,
          companyName: true,
        }),
        ...(role === "faculty" && {
          designation: true,
        }),
      },
    });

    res.json(createResponse(true, "Profile updated successfully", updatedUser));
  } catch (error) {
    handleError(error, req, res);
  }
};
