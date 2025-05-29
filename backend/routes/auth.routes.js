import express from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes
router.post("/register", signup);
// router.post("/google", googleSignup);

router.post("/login", loginLimiter, login);

router.post("/logout", logout);

// Protected routes
router.get("/check", protect, checkAuth);

export default router;
