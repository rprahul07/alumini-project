import { AppError } from "../utils/response.utils.js";

export const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Access denied. Admin privileges required.', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
}; 