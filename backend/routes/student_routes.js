import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudentById,
} from "../controllers/user/student_controller.js";

const router = express.Router();

router.get("/getall", getAllStudents);

router.get("/:userId", getStudentById);
router.delete("/:userId", deleteStudentById);
router.patch("/:userId", protect, updateStudentById);

export default router;
