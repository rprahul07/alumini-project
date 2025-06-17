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
  searchEvents,
} from "../controllers/event/event.controller.js";
import { uploadPhotoMiddleware } from "../middleware/upload.middleware.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllStudents);

router.get("/event/all", getAllEvents);
router.get("/event/search", searchEvents);
router.get("/event/:id", getEventById);

router.patch("/profile/update", uploadPhotoMiddleware, updateMyStudentProfile);
router.get("/profile/get", getMyStudentProfile);
router.delete("/profile/delete-photo", deleteProfilePicture);
router.get("/:userId", getStudentById);
router.delete("/:userId", deleteStudentById);
router.patch("/:userId", updateStudentById);

export default router;
