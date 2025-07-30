import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/user/user_controller.js";
import { protect } from "../middleware/jwt_middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { forgotPassword,verifyOTP } from "../controllers/auth/auth_controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", loginLimiter, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/check", protect, checkAuth);
router.post("/forgot-password",protect,forgotPassword);
router.post("/verify-otp",protect,verifyOTP);

export default router;
