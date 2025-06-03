import jwt from "jsonwebtoken";
import { VALID_ROLES } from "../constants/user_constants.js";
import { findUserByRole } from "../services/user_service.js";
import { AppError, handleError } from "../utils/response.utils.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new AppError("Not authorized, no token", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!VALID_ROLES.includes(decoded.role)) {
      throw new AppError("Invalid role", 400);
    }

    const user = await findUserByRole(decoded.id, decoded.role);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    handleError(error, req, res);
  }
}; 