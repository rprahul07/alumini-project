import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", signup);
// router.post("/google", googleSignup);

router.post("/login", loginLimiter, login);

router.post("/logout", logout);

export default router;
