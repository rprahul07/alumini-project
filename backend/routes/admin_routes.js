import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import {
  getActivityLogs,
  getPasswordChanges,
  getEmailChanges
} from "../controllers/admin/admin_controller.js";

const router = express.Router();


router.use(protect);
router.use(isAdmin);

// Log routes
router.get("/logs/activity", getActivityLogs);
router.get("/logs/password-changes", getPasswordChanges);
router.get("/logs/email-changes", getEmailChanges);

export default router; 