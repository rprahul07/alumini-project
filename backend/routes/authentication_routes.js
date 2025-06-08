import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/user/user_controller.js";
import { protect } from "../middleware/jwt_middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", loginLimiter, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/check", protect, checkAuth);

export default router;
