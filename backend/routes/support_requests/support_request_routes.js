import express from "express";
import { protect } from "../../middleware/jwt_middleware.js";
import {
  createSupportRequest,
  acceptSupportRequest,
  rejectSupportRequest,
  getSupportRequests,
  getAllSupportRequests,
  getSelfAppliedSupportRequests,
  getReceivedSupportRequests,
} from "../../controllers/support_request/support_request_controller.js";

const support_router = express.Router();

// ✅ Apply JWT protection to all routes
support_router.use(protect);

// ✅ Create a new support request (student/alumni)
support_router.post("/create", createSupportRequest);

// ✅ Get all support requests related to current user (student/alumni)
support_router.get("/get", getSupportRequests);

// ✅ Accept a support request (alumni)
support_router.post("/accept/:requestId", acceptSupportRequest);

// ✅ Reject a support request (alumni)
support_router.put("/reject/:requestId", rejectSupportRequest);

// ✅ ADMIN: Get all support requests
support_router.get("/admin/all", getAllSupportRequests);

// ✅ Get self-applied support requests (student/alumni)
support_router.get("/self/applied", getSelfAppliedSupportRequests);

// ✅ Get support requests received by the logged-in alumni
support_router.get("/self/received", getReceivedSupportRequests);

export default support_router;
