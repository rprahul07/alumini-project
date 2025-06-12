import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudentById,
  updateMyStudentProfile,
  getMyStudentProfile,
  deleteProfilePicture
} from "../controllers/user/student_controller.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllStudents);
router.get("/:userId", getStudentById);
router.delete("/:userId", deleteStudentById);
router.patch("/:userId", updateStudentById);
router.patch("/profile/update", updateMyStudentProfile);
router.get("/profile/get", getMyStudentProfile); 
router.delete("/profile/delete-photo", deleteProfilePicture);

export default router;
