import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus
} from "../controllers/job/job.controller.js";

const router = express.Router();
router.use(protect)

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJobById).patch(updateJob).delete(deleteJob);
router.route("/:id/status").patch(isAdmin, updateJobStatus);

export default router;
