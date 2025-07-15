import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudentById,
  updateMyStudentProfile,
  getMyStudentProfile,
  deleteProfilePicture,
} from "../controllers/user/student_controller.js";
import {
  getAllEvents,
  getEventById,
  getRegisteredEventsController,
  searchEvents,
  withdrawFromEvents,
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";
import { registerEventsForStudents } from "../controllers/event/student_event.controller.js";
import { searchAlumniProfilesController, searchStudentsController } from "../controllers/user/user_controller.js";
import { getAlumniByTier } from "../controllers/user/alumni_controller.js";
import { resumableUploadMiddleware } from "../middleware/resumableUpload.middleware.js";
import { resumableMulter } from "../middleware/resumableMulter.middleware.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllStudents);
router.get("/searchalumni", searchAlumniProfilesController);
router.get("/searchstudent", searchStudentsController);
router.patch("/profile/update", uploadPhotoMiddleware, updateMyStudentProfile);
router.post("/upload/resume", resumableMulter, resumableUploadMiddleware);
router.get("/profile/get", getMyStudentProfile);
router.delete("/profile/delete-photo", deleteProfilePicture);

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);
router.get("/event/my", getRegisteredEventsController);
router.get("/event/:id", getEventById);
router.post("/event/:id", registerEventsForStudents);
router.delete("/event/:id", withdrawFromEvents);

router.get("/tier/:alumniId", getAlumniByTier);
router.get("/:userId", getStudentById);
router.delete("/:userId", deleteStudentById);
router.patch("/:userId", updateStudentById);

export default router;
