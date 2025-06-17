import {
  createEventForUser,
  deleteEventForUser,
  editEventForUser,
} from "../../services/event_service.js";
import { deletePhotoById } from "../../utils/handlePhotoUpload.utils.js";

export const createEventForFaculty = async (req, res) => {
  // Check if user role is faculty
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only faculty can create events.",
      error: "Insufficient permissions",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const imageUrl = await handlePhotoUpload(req, null, "event");
  const eventData = {
    ...req.body,
    imageUrl,
  };

  const result = await createEventForUser(userId, userRole, eventData);

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    ...(result.data && { data: result.data }),
    ...(result.error && { error: result.error }),
  });
};

export const editEventForFaculty = async (req, res) => {
  // Check if user role is faculty
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only faculty can edit events.",
      error: "Insufficient permissions",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const eventId = parseInt(req.params.id);
  const eventData = req.body;

  const result = await editEventForUser(userId, userRole, eventId, eventData);

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    ...(result.data && { data: result.data }),
    ...(result.error && { error: result.error }),
  });
};

export const deleteEventForFaculty = async (req, res) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only faculty can delete events.",
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
