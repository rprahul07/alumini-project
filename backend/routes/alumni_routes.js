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
  getAlumniByTier,
} from "../controllers/user/alumni_controller.js";
import {
  createEventForAlumni,
  deleteEventForAlumni,
  editEventForAlumni,
  getMyEventsForAlumni,
  registerEventsForAlumni,
} from "../controllers/event/alumni_event.controller.js";
import {
  getAllEvents,
  getEventById,
  getEventRegistrationsController,
  getRegisteredEventsController,
  removeUserFromEventController,
  searchEvents,
  withdrawFromEvents,
  
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";
import { resumableUploadMiddleware } from "../middleware/resumableUpload.middleware.js";
import { resumableMulter } from "../middleware/resumableMulter.middleware.js";
import {
  searchAlumniProfilesController,
  searchStudentsController,
} from "../controllers/user/user_controller.js";

const router = express.Router();

router.use(protect);

router.get("/getall", getAllAlumni);
router.get("/profile/get", getAlumniSelf);
router.patch("/profile/update", uploadPhotoMiddleware, updateAlumniSelf);
router.post("/upload/resume", resumableMulter, resumableUploadMiddleware);
router.delete("/profile/delete-photo", deleteProfilePicture);
router.get("/searchalumni", searchAlumniProfilesController);
router.get("/searchstudent", searchStudentsController);

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);
router.post("/event/create", uploadPhotoMiddleware, createEventForAlumni);
router.get("/event/my", getMyEventsForAlumni);
router.get("/event/myregistrations", getRegisteredEventsController);
router.patch("/event/:id", uploadPhotoMiddleware, editEventForAlumni);
router.delete("/event/:id", uploadPhotoMiddleware, deleteEventForAlumni);
router.get("/event/:id", getEventById);
router.post("/event/:id", registerEventsForAlumni);
router.delete("/event/withdraw/:id", withdrawFromEvents);
router.get("/event/user/:id", getEventRegistrationsController);
router.delete(
  "/event/:eventId/remove-user/:userIdToRemove",
  removeUserFromEventController
);

router.get("/tier/:alumniId", getAlumniByTier);
router.get("/:userId", getAlumniById);
router.delete("/:userId", deleteAlumniById);
router.patch("/:userId", updateAlumniById);
router.get("/events/registered", getRegisteredEventsController);

export default router;
