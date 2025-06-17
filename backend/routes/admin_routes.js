import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import {
  getAdminDashboardStats,
  getAdminProfile,
  createAdmin,
} from "../controllers/admin/admin_controller.js";
import {
  createEventForAdmin,
  deleteEventByIdForAdmin,
  editEventByIdForAdmin,
  getAllEventsForAdmin,
  getEventByIdForAdmin,
} from "../controllers/event/admin_event.controller.js";
import { deleteAlumniById } from "../controllers/user/alumni_controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";

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

router.post("/event/create", uploadPhotoMiddleware, createEventForAdmin);
router.get("/event/all", getAllEventsForAdmin);
router.patch("/event/:id", uploadPhotoMiddleware, editEventByIdForAdmin);
router.get("/event/:id", getEventByIdForAdmin);
router.delete("/event/:id", deleteEventByIdForAdmin);

export default router;
