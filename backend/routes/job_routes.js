import express from "express";
import { protect } from "../middleware/jwt_middleware.js";
import { isAdmin } from "../middleware/role_middleware.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  registerJob,
  getJobRegistrationPrefillData,
  pendingJobsForAdmin,
  getAllJobsForAlumni,
  getAllJobsForAdmin,
  getJobRegistrations,
  MyAppliedJobs
} from "../controllers/job/job.controller.js";

const router = express.Router();
router.use(protect)

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJobById).patch(updateJob).delete(deleteJob);
router.route("/:id/status").patch(isAdmin, updateJobStatus);
router.route("/:id/register").post(registerJob);
router.route("/register/prefill").get(getJobRegistrationPrefillData);
router.route("/admin/pending").get(pendingJobsForAdmin);
router.route("/alumni/created").get(getAllJobsForAlumni);
router.route("/admin/all").get(isAdmin, getAllJobsForAdmin);
router.route("/get/registrations").post(getJobRegistrations);
router.route("/selfapplied").get(MyAppliedJobs)

export default router;
