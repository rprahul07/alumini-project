import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import { getAdminDashboardStats, getAdminProfile, createAdmin } from "../controllers/admin/admin_controller.js";

const router = express.Router();

// Apply protect middleware to all admin routes
router.use(protect);
router.use(isAdmin);

// Admin dashboard stats
router.get("/dashboard-stats", getAdminDashboardStats);

// Admin profile    
router.get("/profile", getAdminProfile);

// Create new admin (only super admin can do this)
router.post("/create", createAdmin);

export default router; 