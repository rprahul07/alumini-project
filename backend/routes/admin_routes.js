import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import {
  getActivityLogs,
  getPasswordChanges,
  getEmailChanges
} from "../controllers/admin_controller.js";

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(isAdmin);

// Log routes
router.get("/logs/activity", getActivityLogs);
router.get("/logs/password-changes", getPasswordChanges);
router.get("/logs/email-changes", getEmailChanges);

export default router; 