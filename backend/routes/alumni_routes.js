// FIXED: Put specific routes BEFORE dynamic parameter routes
import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

import {
  deleteAlumniById,
  getAllAlumni,
  getAlumniById,
  updateAlumniById,
  updateAlumniSelf,
  getAlumniSelf,
  deleteProfilePicture,
} from "../controllers/user/alumni_controller.js";
import {
  createEventForAlumni,
  deleteEventForAlumni,
  editEventForAlumni,
} from "../controllers/event/alumni_event.controller.js";
import {
  getAllEvents,
  getEventById,
  searchEvents,
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/getall", getAllAlumni);
router.get("/profile/get", getAlumniSelf);
router.patch("/profile/update", uploadPhotoMiddleware, updateAlumniSelf);
router.delete("/profile/delete-photo", deleteProfilePicture);

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);
router.post("/event/create", uploadPhotoMiddleware, createEventForAlumni);
router.patch("/event/:id", uploadPhotoMiddleware, editEventForAlumni);
router.delete("/event/:id", uploadPhotoMiddleware, deleteEventForAlumni);
router.get("/event/:id", getEventById);

router.get("/:userId", getAlumniById);
router.delete("/:userId", deleteAlumniById);
router.patch("/:userId", updateAlumniById);

export default router;
