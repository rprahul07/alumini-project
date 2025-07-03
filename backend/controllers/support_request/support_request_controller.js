import prisma from "../../lib/prisma.js";
import { sendEmailToAlumni } from "../../utils/sendEmail.js";

/**
 * Create a new support request
 * Roles allowed: student, alumni
 */
export const createSupportRequest = async (req, res) => {
  if (!["student", "alumni"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only students and alumni can create support requests.",
    });
  }

  const { user_id, alumni_id, descriptionbyUser, status } = req.body;

  if (!user_id || !alumni_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: user_id or alumni_id.",
    });
  }

  try {
    const supportRequest = await prisma.supportRequest.create({
      data: {
        support_requester: user_id,
        alumniId: alumni_id,
        status: status || "pending",
        descriptionbyUser: descriptionbyUser || "",
      },
    });

    const alumni = await prisma.user.findUnique({
      where: { id: alumni_id },
    });

    let emailStatus = null;

    if (alumni?.email) {
      emailStatus = await sendEmailToAlumni({
        to: alumni.email,
        subject: "New Support Request Received",
        body: `<p>Hi ${alumni.fullName || "Alumni"},</p>
               <p>You have received a new support request from User ID: <b>${alumni.fullName}</b>.</p>
               <p>Please check your alumni dashboard to respond.</p>`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Support request created successfully.",
      emailSent: !!alumni?.email,
      data: supportRequest,
      emailStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create support request.",
      error: error.message,
    });
  }
};

/**
 * Accept a support request
 * Roles allowed: alumni
 */
export const acceptSupportRequest = async (req, res) => {
  const { alumniMsg, alumniId } = req.body;
  const requestId = parseInt(req.params.requestId);

  if (req.user.role !== "alumni" && req.user.id !== alumniId) {
    return res.status(403).json({
      success: false,
      message: "Only assigned alumni can accept support requests.",
    });
  }

  if (!alumniMsg || typeof alumniMsg !== "string" || alumniMsg.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Alumni message is required and must be a non-empty string.",
    });
  }

  if (isNaN(requestId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request ID.",
    });
  }

  try {
    const updatedRequest = await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
        descriptionbyAlumni: alumniMsg,
        // Optionally add alumniImage here
      },
    });

    // Fetch support requester details
    const userData = await prisma.user.findUnique({
      where: { id: updatedRequest.support_requester }
    });

    return res.status(200).json({
      success: true,
      message: "Support request accepted successfully.",
      data: updatedRequest,
      user: userData || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to accept support request.",
      error: error.message,
    });
  }
};

/**
 * Reject a support request
 * Roles allowed: alumni
 */
export const rejectSupportRequest = async (req, res) => {
  const requestId = parseInt(req.params.requestId);

  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Only alumni can reject support requests.",
    });
  }

  if (isNaN(requestId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request ID.",
    });
  }

  try {
    const updatedRequest = await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: "rejected",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Support request rejected successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject support request.",
      error: error.message,
    });
  }
};

/**
 * Get support requests related to user
 * Roles allowed: student, alumni
 */
export const getSupportRequests = async (req, res) => {
  if (!["student", "alumni"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only students and alumni can view support requests.",
    });
  }

  try {
    const supportRequests = await prisma.supportRequest.findMany({
      where: {
        OR: [
          { support_requester: req.user.id },
          { alumniId: req.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Support requests fetched successfully.",
      data: supportRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support requests.",
      error: error.message,
    });
  }
};

/**
 * Admin: Get all support requests
 */
export const getAllSupportRequests = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({
  //     success: false,
  //     message: "Only admin can access all support requests.",
  //   });
  // }

  try {
    const supportRequests = await prisma.supportRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        requester: true, // update if relations exist
        alumni: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All support requests fetched successfully.",
      data: supportRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support requests.",
      error: error.message,
    });
  }
};

/**
 * Get requests created by the logged-in user
 * Roles: student, alumni
 */
export const getSelfAppliedSupportRequests = async (req, res) => {
  if (!["student", "alumni"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only students and alumni can view their requests.",
    });
  }

  try {
    const requests = await prisma.supportRequest.findMany({
      where: { support_requester: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Your support requests fetched successfully.",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your support requests.",
      error: error.message,
    });
  }
};

/**
 * Get support requests received by the alumni
 */
export const getReceivedSupportRequests = async (req, res) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Only alumni can view received requests.",
    });
  }

  try {
    const requests = await prisma.supportRequest.findMany({
      where: { alumniId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Received support requests fetched successfully.",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch received support requests.",
      error: error.message,
    });
  }
};
