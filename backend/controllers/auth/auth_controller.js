import { AppError } from "../../utils/response.utils.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import {
  validatePassword,
  validateUserData,
  checkEmailExists,
  findUserByRole,
  verifyPassword,
} from "../../services/user_service.js";
import { createStudent } from "../user/student_controller.js";
import { createAlumni } from "../user/alumni_controller.js";
import { createFaculty } from "../user/faculty_controller.js";
import { ROLES } from "../../constants/user_constants.js";
import { sendEmailToAlumni } from "../../utils/sendEmail.js";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      throw new AppError("Passwords don't match", 400);
    }

    validatePassword(password);
    validateUserData(req.body, role);

    if (await checkEmailExists(req.body.email)) {
      throw new AppError("Email already exists", 409);
    }

    let newUser;
    switch (role) {
      case ROLES.STUDENT:
        newUser = await createStudent(req.body);
        break;
      case ROLES.ALUMNI:
        newUser = await createAlumni(req.body);
        break;
      case ROLES.FACULTY:
        newUser = await createFaculty(req.body);
        break;
      default:
        throw new AppError("Invalid role specified", 400);
    }

    generateTokenAndSetCookie(newUser.id, role, res);

    res.status(201).json(
      createResponse(true, `${role} registered successfully`, {
        _id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role,
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new AppError("Please provide email, password and role", 400);
    }

    // Find user by email and role
    const user = await findUserByRole(email, role, {
      id: true,
      fullName: true,
      email: true,
      password: true,
    });

    // If no user found or password doesn't match, return generic error
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      // Log the attempt for debugging
      console.log('Failed login attempt:', {
        email,
        role,
        passwordMatch: isPasswordValid
      });
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(user.id, role, res);

    // Return success response
    res.status(200).json(
      createResponse(true, "Logged in successfully", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role,
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json(createResponse(true, "Logged out successfully"));
  } catch (error) {
    handleError(error, req, res);
  }
};

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


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) throw new AppError("Email is required", 400);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) throw new AppError("User not found", 404);

    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();

    // Upsert token
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendEmailToAlumni({
      to: user.email,
      subject: "Password Reset",
      body: `<p>Your OTP is <b>${resetToken}</b>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json(createResponse(true, "OTP sent to your email."));
  } catch (error) {
    handleError(error, req, res);
  }
};

export const verifyOTPAndResetPassword= async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      throw new AppError("Email, OTP, and new password are required", 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Find OTP record for the user
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { userId: user.id },
    });

    if (
      !resetRecord ||
      resetRecord.token !== otp ||
      resetRecord.expiresAt < new Date()
    ) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete OTP record after successful reset
    await prisma.passwordReset.delete({
      where: { userId: user.id },
    });

    res.status(200).json(createResponse(true, "Password reset successful"));
  } catch (error) {
    handleError(error, req, res);
  }
};