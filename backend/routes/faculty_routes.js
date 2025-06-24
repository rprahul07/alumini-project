import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteFacultyById,
  getAllFaculty,
  getFacultyById,
  updateFacultyById,
  updateMyFacultyProfile,
  getMyFacultyProfile,
  deleteProfilePicture,
} from "../controllers/user/faculty_controller.js";
import {
  createEventForFaculty,
  deleteEventForFaculty,
  editEventForFaculty,
  getMyEventsForFaculty,
  registerEventsForFaculty,
} from "../controllers/event/faculty_event.controller.js";
import {
  getAllEvents,
  getEventById,
  searchEvents,
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllFaculty);
router.get("/:userId", getFacultyById);
router.delete("/:userId", deleteFacultyById);
router.patch("/:userId", updateFacultyById);

router.get("/event/all", getAllEvents);
router.post("/event/create", uploadPhotoMiddleware, createEventForFaculty);
router.get("/event/search", searchEvents);
router.get("/event/my", getMyEventsForFaculty);
router.patch("/event/:id", uploadPhotoMiddleware, editEventForFaculty);
router.delete("/event/:id", uploadPhotoMiddleware, deleteEventForFaculty);
router.get("/event/:id", getEventById);
router.post("/event/:id", registerEventsForFaculty);

router.patch("/profile/update", uploadPhotoMiddleware, updateMyFacultyProfile);
router.get("/profile/get", getMyFacultyProfile);
router.delete("/profile/delete-photo", deleteProfilePicture);

export default router;
