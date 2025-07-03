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
  getRegisteredEventsController,
  removeUserFromEventController,
  searchEvents,
  withdrawFromEvents,
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";
import { getEventRegistrations } from "../services/event_service.js";
import { searchStudentsController } from "../controllers/user/user_controller.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllFaculty);
router.get("/searchstudent", searchStudentsController);
router.patch("/profile/update", uploadPhotoMiddleware, updateMyFacultyProfile);
router.get("/profile/get", getMyFacultyProfile);
router.delete("/profile/delete-photo", deleteProfilePicture);

router.get("/event/all", getAllEvents);
router.post("/event/create", uploadPhotoMiddleware, createEventForFaculty);
router.get("/event/search", searchEvents);
router.get("/event/my", getMyEventsForFaculty);
router.patch("/event/:id", uploadPhotoMiddleware, editEventForFaculty);
router.delete("/event/:id", uploadPhotoMiddleware, deleteEventForFaculty);
router.get("/event/:id", getEventById);
router.post("/event/:id", registerEventsForFaculty);
router.delete("/event/:id", withdrawFromEvents);
router.get("/event/my/:id", getRegisteredEventsController);
router.get("/event/user/:id", getEventRegistrations);
router.delete(
  "/event/:eventId/remove-user/:userIdToRemove",
  removeUserFromEventController
);

router.get("/:userId", getFacultyById);
router.delete("/:userId", deleteFacultyById);
router.patch("/:userId", updateFacultyById);

export default router;
