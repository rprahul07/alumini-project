import prisma from "../../lib/prisma.js";
import {
  createEventForUser,
  deleteEventForUser,
  editEventForUser,
  getMyEvents,
  registerForEvents,
} from "../../services/event_service.js";
import {
  deletePhotoById,
  handlePhotoUpload,
  updateEventImage,
} from "../../utils/handlePhotoUpload.utils.js";

export const createEventForAlumni = async (req, res) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only alumni can create events.",
      error: "Insufficient permissions",
    });
  }

  const eventData = {
    ...req.body,
    imageUrl: null,
  };

  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await createEventForUser(userId, userRole, eventData);
  if (!result?.success || !result.data?.id) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create event" });
  }

  const eventId = result.data.id;
  const imageUrl = await handlePhotoUpload(req, null, "event", eventId);
  if (imageUrl) {
    await updateEventImage(eventId, imageUrl);
    result.data.imageUrl = imageUrl;
  }
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    ...(result.data && { data: result.data }),
    ...(result.error && { error: result.error }),
  });
};

export const editEventForAlumni = async (req, res) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only alumni can edit events.",
      error: "Insufficient permissions",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const eventId = parseInt(req.params.id);
  const imageUrl = await handlePhotoUpload(req, null, "event", eventId);
  const eventData = {
    ...req.body,
    imageUrl,
  };

  const result = await editEventForUser(userId, userRole, eventId, eventData);
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    ...(result.data && { data: result.data }),
    ...(result.error && { error: result.error }),
  });
};

export const deleteEventForAlumni = async (req, res) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only alumni can delete events.",
      error: "Insufficient permissions",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const eventId = parseInt(req.params.id);
  deletePhotoById(eventId);
  const result = await deleteEventForUser(userId, userRole, eventId);
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    ...(result.data && { data: result.data }),
    ...(result.error && { error: result.error }),
  });
};

export const registerEventsForAlumni = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can register for events.",
        error: "Insufficient permissions",
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;
    const eventId = parseInt(req.params.id);

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
      });
    }

    const result = await registerForEvents(userId, userRole, eventId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      let statusCode = 500;
      if (result.message.includes("not found")) {
        statusCode = 404;
      } else if (
        result.message.includes("Invalid") ||
        result.message.includes("already registered") ||
        result.message.includes("not approved") ||
        result.message.includes("past events") ||
        result.message.includes("full capacity")
      ) {
        statusCode = 400;
      }

      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error("Error in registerEventsForAlumni:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMyEventsForAlumni = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can",
        error: "Insufficient permissions",
      });
    }
    const userId = req.user.id;
    const userRole = req.user.role;
    const { page, limit, status } = req.query;

    const result = await getMyEvents(userId, userRole, { page, limit, status });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
