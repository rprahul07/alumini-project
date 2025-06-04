import { AppError } from "../../utils/response.utils.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import {
  validatePassword,
  validateUserData,
  checkEmailExists,
  findUserByRole,
  verifyPassword
} from "../services/user.service.js";
import { createStudent } from "./student.controller.js";
import { createAlumni } from "./alumni_controller.js";
import { createFaculty } from "./faculty_controller.js";
import { ROLES } from "../../constants/user_constants.js";

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

    res.status(201).json(createResponse(
      true,
      `${role} registered successfully`,
      {
        _id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role
      }
    ));
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

    const user = await findUserByRole(email, role, {
      id: true,
      fullName: true,
      email: true,
      password: true
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    generateTokenAndSetCookie(user.id, role, res);
    
    res.status(200).json(createResponse(
      true,
      "Logged in successfully",
      {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role
      }
    ));
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

    const user = await findUserByRole(
      req.user.id,
      req.user.role,
      { id: true, fullName: true, email: true }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(createResponse(
      true,
      "User authenticated",
      {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: req.user.role
      }
    ));
  } catch (error) {
    handleError(error, req, res);
  }
}; 