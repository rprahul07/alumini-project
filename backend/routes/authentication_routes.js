import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth
} from "../controllers/user_controller.js";
import { protect } from "../middleware/jwt_middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post("/register", signup);
router.post("/signup", signup);
// router.post("/google", googleSignup);

// Rate limited routes
router.post("/login", loginLimiter, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/check", protect, checkAuth);

export default router;
