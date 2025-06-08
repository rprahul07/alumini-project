import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteFacultyById,
  getAllFaculty,
  getFacultyById,
  updateFacultyById,
} from "../controllers/user/faculty_controller.js";

const router = express.Router();

router.get("/getall", protect, getAllFaculty);

router.get("/:userId", protect, getFacultyById);
router.delete("/:userId", protect, deleteFacultyById);
router.patch("/:userId", protect, updateFacultyById);

export default router;
