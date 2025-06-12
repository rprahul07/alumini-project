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
  deleteProfilePicture
} from "../controllers/user/alumni_controller.js";

const router = express.Router();
// Apply login rate limiting to all alumni routes
router.use(protect)

router.get("/getall", getAllAlumni);

router.get("/:userId", getAlumniById);
router.delete("/:userId", deleteAlumniById);
router.patch("/:userId", updateAlumniById);
router.patch("/profile/update", updateAlumniSelf);
router.get("/profile/get", getAlumniSelf);
router.delete("/profile/delete-photo", deleteProfilePicture);

export default router;
