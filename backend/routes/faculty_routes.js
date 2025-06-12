import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import {
  deleteFacultyById,
  getAllFaculty,
  getFacultyById,
  updateFacultyById,
  updateMyFacultyProfile,
  getMyFacultyProfile,
  deleteProfilePicture
} from "../controllers/user/faculty_controller.js";

const router = express.Router();
router.get("/getall", protect, getAllFaculty);
router.get("/:userId", protect, getFacultyById);
router.delete("/:userId", protect, deleteFacultyById);
router.patch("/:userId", protect, updateFacultyById);
router.patch("/profile/update", protect, updateMyFacultyProfile);
router.get("/profile/get", protect, getMyFacultyProfile);
router.delete("/profile/delete-photo", deleteProfilePicture);



export default router;
