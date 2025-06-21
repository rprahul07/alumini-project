import { registerForEvents } from "../../services/event_service.js";

export const registerEventsForStudents = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Students can register for events.",
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
    console.error("Error in registerEventsForStudents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
