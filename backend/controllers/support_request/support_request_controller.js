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

  const {  alumni_id, descriptionbyUser, status } = req.body;

  if (!alumni_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: alumni_id.",
    });
  }

  try {
    const supportRequest = await prisma.supportRequest.create({
      data: {
        support_requester: req.user.id, // Use the logged-in user's ID
        alumniId: alumni_id,
        status: status || "pending",
        descriptionbyUser: descriptionbyUser || "",
      },
      include: {
        
        alumni: true, // Include alumni details from user table
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
  const { alumniMsg, tier } = req.body;
  const requestId = parseInt(req.params.requestId);

  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Only alumni can accept support requests.",
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
    // 1. Fetch the support request
    const supportRequest = await prisma.supportRequest.findUnique({
      where: { id: requestId },
    });
    console.log(supportRequest)
    if (!supportRequest) {
      return res.status(404).json({
        success: false,
        message: "Support request not found.",
      });
    }

    // 2. Check if the current user is the assigned alumni
    if (supportRequest.alumniId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this support request.",
      });
    }

    // 3. Update the request
    const updatedRequest = await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
        descriptionbyAlumni: alumniMsg,
        tier: tier || 1, // Default to tier 1 if not provided
      },
    });

    // 4. Get the requester user details
    const userData = await prisma.user.findUnique({
      where: { id: updatedRequest.support_requester },
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
          { alumniId: req.user.id }, // alumni can see requests assigned to them
         
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        alumni: true, // ✅ include alumni details from user table
      },
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
      include: {
        alumni:{
          select:{
            id: true,
            fullName: true,
            photoUrl: true,
          }
        } // Include alumni details from user table
      },
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
  // 1. Ensure only logged-in alumni can access
  if (!req.user || req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Only assigned alumni can access this resource.",
    });
  }

  try {
    // 2. Fetch requests assigned to this alumni only
    const requests = await prisma.supportRequest.findMany({
      where: {
        alumniId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        requester: true, // Include requester user details
      },
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
