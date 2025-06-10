import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudentById,
  updateMyStudentProfile,
  getMyStudentProfile,
} from "../controllers/user/student_controller.js";

const router = express.Router();
router.use(protect);
router.get("/getall", getAllStudents);
router.get("/:userId", getStudentById);
router.delete("/:userId", deleteStudentById);
router.patch("/:userId", updateStudentById);
router.patch("/profile/update", updateMyStudentProfile);
router.get("/profile/get", getMyStudentProfile); // Assuming this is for self-update

export default router;
  