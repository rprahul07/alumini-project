import express from "express";
import {
  getAllEvents,
  searchEvents,
  getRegisteredEventsController,
} from "../controllers/event/event.controller.js";
import { getAdminDashboardStats } from "../controllers/admin/admin_controller.js";
import { getPublicTestimonials } from "../controllers/testimonial/testimonial_controller.js";
import { getAllGallery } from "../controllers/gallery/gallery_controller.js";
import { getLatestReconnects } from "../controllers/user/alumni_controller.js";

const router = express.Router();

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);
router.get("/dashboard-stats", getAdminDashboardStats);
router.get("/testimonials", getPublicTestimonials);
router.get("/gallery", getAllGallery);
router.get("/latest-reconnects", getLatestReconnects);


export default router;
