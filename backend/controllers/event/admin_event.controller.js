import prisma from "../../lib/prisma.js";
import {
  deletePhotoById,
  updateEventImage,
} from "../../utils/handlePhotoUpload.utils.js";

export const createEventForAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admins can create events.",
      error: "Insufficient permissions",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const eventData = {
    ...req.body,
    imageUrl: null,
  };

  const result = await createEventForUser(userId, userRole, eventData);
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
export const editEventByIdForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can create events.",
        error: "Insufficient permissions",
      });
    }

    console.log(
      "Admin editing event ID:",
      eventId,
      "by user ID:",
      userId,
      "with role:",
      userRole
    );

    // Check if user is admin
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can edit any event.",
      });
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
      });
    }

    // Check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const updateData = {};

    const imageUrl = await handlePhotoUpload(req, null, "event", eventId);
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }
    // Prepare update data

    if (eventData.name !== undefined) updateData.name = eventData.name.trim();
    if (eventData.date !== undefined) {
      const eventDate = new Date(eventData.date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format provided.",
        });
      }
      updateData.date = eventDate;
    }
    if (eventData.time !== undefined) updateData.time = eventData.time.trim();
    if (eventData.type !== undefined) updateData.type = eventData.type.trim();
    if (eventData.description !== undefined)
      updateData.description = eventData.description?.trim() || null;
    if (eventData.location !== undefined)
      updateData.location = eventData.location.trim();
    if (eventData.organizer !== undefined)
      updateData.organizer = eventData.organizer.trim();
    if (eventData.imageUrl !== undefined)
      updateData.imageUrl = eventData.imageUrl?.trim() || null;

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            photoUrl: true,
            department: true,
          },
        },
      },
    });

    console.log("Event updated successfully by admin:", updatedEvent.id);

    // Format the response data
    const formattedEvent = {
      id: updatedEvent.id,
      name: updatedEvent.name,
      date: updatedEvent.date,
      time: updatedEvent.time,
      type: updatedEvent.type,
      description: updatedEvent.description,
      location: updatedEvent.location,
      organizer: updatedEvent.organizer,
      imageUrl: updatedEvent.imageUrl,
      createdAt: updatedEvent.createdAt,
      updatedAt: updatedEvent.updatedAt,
      createdBy: {
        id: updatedEvent.user.id,
        fullName: updatedEvent.user.fullName,
        email: updatedEvent.user.email,
        role: updatedEvent.user.role,
        photoUrl: updatedEvent.user.photoUrl,
        department: updatedEvent.user.department,
      },
    };

    res.status(200).json({
      success: true,
      message: "Event updated successfully by admin",
      data: {
        event: formattedEvent,
        originalCreator: {
          id: existingEvent.user.id,
          fullName: existingEvent.user.fullName,
          role: existingEvent.user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error in editEventByIdForAdmin:", error);

    // Handle Prisma specific errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Event not found or already deleted.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const deleteEventByIdForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const eventId = parseInt(req.params.id);
    deletePhotoById(eventId);
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can create events.",
        error: "Insufficient permissions",
      });
    }

    console.log(
      "Admin deleting event ID:",
      eventId,
      "by user ID:",
      userId,
      "with role:",
      userRole
    );

    // Check if user is admin
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete any event.",
      });
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
      });
    }

    // Check if the event exists and get event details before deletion
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            photoUrl: true,
            department: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Store event details before deletion for response
    const deletedEventInfo = {
      id: existingEvent.id,
      name: existingEvent.name,
      date: existingEvent.date,
      time: existingEvent.time,
      type: existingEvent.type,
      location: existingEvent.location,
      organizer: existingEvent.organizer,
      originalCreator: {
        id: existingEvent.user.id,
        fullName: existingEvent.user.fullName,
        email: existingEvent.user.email,
        role: existingEvent.user.role,
        department: existingEvent.user.department,
      },
      deletedBy: {
        id: userId,
        role: userRole,
      },
    };

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    console.log("Event deleted successfully by admin:", deletedEventInfo);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully by admin",
      data: deletedEventInfo,
    });
  } catch (error) {
    console.error("Error in deleteEventByIdForAdmin:", error);

    // Handle Prisma specific errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Event not found or already deleted.",
      });
    }

    // Handle foreign key constraint errors
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete event due to existing related records.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const getEventByIdForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const eventId = parseInt(req.params.id);

    console.log(
      "Fetching event ID:",
      eventId,
      "for user ID:",
      userId,
      "with role:",
      userRole
    );

    // Restrict access to admin only
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view event details.",
      });
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
      });
    }

    // Fetch the event by ID
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true, // Added phone number
            role: true,
            photoUrl: true,
            department: true,
          },
        },
      },
    });

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    console.log(`Found event: ${event.name} for ${userRole}`);

    // Format the response data
    const formattedEvent = {
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      location: event.location,
      organizer: event.organizer,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.user.id,
        fullName: event.user.fullName,
        email: event.user.email,
        phoneNumber: event.user.phoneNumber, // Added phone number
        role: event.user.role,
        photoUrl: event.user.photoUrl,
        department: event.user.department,
      },
    };

    // Add metadata for permissions
    const responseData = {
      event: formattedEvent,
      metadata: {
        canEdit: userRole === "admin",
        canDelete: userRole === "admin",
        viewerRole: userRole,
        isCreator: event.userId === userId,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getEventById:", error);

    // Handle Prisma specific errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event",
      error: error.message,
    });
  }
};

export const getAllEventsForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log(
      "Fetching all events for user ID:",
      userId,
      "with role:",
      userRole
    );

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view events.",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Get total count for pagination
    const totalEvents = await prisma.event.count();

    // Fetch events with pagination
    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true, // Added phone number
            role: true,
            photoUrl: true,
          },
        },
      },
    });

    console.log(`Found ${events.length} events out of ${totalEvents} total`);

    // Format the response data
    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      location: event.location,
      organizer: event.organizer,
      imageUrl: event.imageUrl,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.user.id,
        fullName: event.user.fullName,
        email: event.user.email,
        phoneNumber: event.user.phoneNumber, // Added phone number
        role: event.user.role,
        photoUrl: event.user.photoUrl,
      },
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalEvents / pageSize);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: {
        events: formattedEvents,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalEvents,
          eventsPerPage: pageSize,
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events",
      error: error.message,
    });
  }
};
