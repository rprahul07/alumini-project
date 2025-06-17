import prisma from "../../lib/prisma.js";
import {
  createEventForUser,
  deleteEventForUser,
  editEventForUser,
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
