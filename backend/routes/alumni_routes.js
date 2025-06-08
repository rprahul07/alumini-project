import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import {
  deleteAlumniById,
  getAllAlumni,
  getAlumniById,
  updateAlumniById,
} from "../controllers/user/alumni_controller.js";

const router = express.Router();

router.get("/getall", protect, getAllAlumni);

router.get("/:userId", protect, getAlumniById);
router.delete("/:userId", protect, deleteAlumniById);
router.patch("/:userId", protect, updateAlumniById);

export default router;
