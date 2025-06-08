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
// Apply login rate limiting to all alumni routes
router.use(protect)

router.get("/getall", getAllAlumni);

router.get("/:userId", getAlumniById);
router.delete("/:userId", deleteAlumniById);
router.patch("/:userId", updateAlumniById);

export default router;
