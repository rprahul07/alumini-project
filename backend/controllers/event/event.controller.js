import prisma from "../../lib/prisma.js";
import {
  getEventRegistrations,
  removeUserFromEvent,
  withdrawFromEvent,
} from "../../services/event_service.js";
import { getRegisteredEvents } from "../../services/event_service.js";

export const removeUserFromEventController = async (req, res) => {
  try {
    // Only organizers (admin, faculty) and the event creator can remove users
    const allowedRoles = ["admin", "faculty", "alumni"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only administrators and faculty can remove users from events.",
        error: "Insufficient permissions",
      });
    }

    const organizerUserId = req.user.id;
    const organizerRole = req.user.role;
    const { eventId, userIdToRemove } = req.params;

    // Validate required parameters
    if (!eventId || !userIdToRemove) {
      return res.status(400).json({
        success: false,
        message: "Event ID and User ID are required.",
        error: "Missing required parameters",
      });
    }

    const result = await removeUserFromEvent(
      organizerUserId,
      organizerRole,
      eventId,
      userIdToRemove
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      let statusCode = 500;

      // Handle specific error cases with appropriate status codes
      if (
        result.message.includes("Invalid event ID") ||
        result.message.includes("Invalid user ID")
      ) {
        statusCode = 400; // Bad Request
      } else if (
        result.message.includes("not found") ||
        result.message.includes("don't have permission")
      ) {
        statusCode = 404; // Not Found
      } else if (result.message.includes("not registered")) {
        statusCode = 409; // Conflict
      } else if (result.message.includes("past events")) {
        statusCode = 422; // Unprocessable Entity
      } else if (result.message.includes("Registration not found")) {
        statusCode = 404; // Not Found
      }

      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error("Error in removeUserFromEventController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getEventRegistrationsController = async (req, res) => {
  try {
    if (!["faculty", "alumni", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only faculty, alumni, and admin can view event registrations.",
        error: "Insufficient permissions",
      });
    }

    const organizerUserId = req.user.id;
    const eventId = req.params.eventId ? parseInt(req.params.eventId) : null;

    if (req.params.eventId && (isNaN(eventId) || eventId <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
        error: "Invalid parameters",
      });
    }

    const result = await getEventRegistrations(organizerUserId, eventId);

    const statusCode = result.success ? 200 : 400;

    return res.status(statusCode).json({
      success: result.success,
      message: result.message,
      ...(result.data && { data: result.data }),
      ...(result.error && { error: result.error }),
    });
  } catch (error) {
    console.error("Error in getEventRegistrationsController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving event registrations.",
      error: "Server error",
    });
  }
};
export const getRegisteredEventsController = async (req, res) => {
  try {
    // Only students, faculty, and alumni are allowed
    const allowedRoles = ["student", "faculty", "alumni"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only students, faculty, and alumni can view registered events.",
        error: "Insufficient permissions",
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await getRegisteredEvents(userId, userRole);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      let statusCode = 500;
      if (result.message.includes("Invalid user ID")) {
        statusCode = 400;
      }

      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error("Error in getRegisteredEventsController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const withdrawFromEvents = async (req, res) => {
  try {
    // Check if user has valid role (exclude admin from event registration/withdrawal)
    const allowedRoles = ["student", "faculty", "alumni"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only students, faculty, and alumni can withdraw from events.",
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

    const result = await withdrawFromEvent(userId, userRole, eventId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      let statusCode = 500;
      if (
        result.message.includes("not found") ||
        result.message.includes("Event not found")
      ) {
        statusCode = 404;
      } else if (
        result.message.includes("Invalid") ||
        result.message.includes("not registered") ||
        result.message.includes("past events") ||
        result.message.includes("rejected events") ||
        result.message.includes("already withdrawn")
      ) {
        statusCode = 400;
      }

      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error("Error in withdrawFromEvents:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getEventById = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const userRole = req.user?.role || null;
    const isAuthenticated = !!userId;
    const eventId = parseInt(req.params.id);

    console.log(
      "Fetching event ID:",
      eventId,
      "for user ID:",
      userId || "public",
      "with role:",
      userRole || "public"
    );

    if (isAuthenticated && !["faculty", "alumni"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only faculty and alumni can view event details.",
      });
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID provided.",
      });
    }

    // Execute queries in parallel
    const [event, userRegistration] = await Promise.all([
      // Get event details
      prisma.event.findUnique({
        where: {
          id: eventId,
          status: "approved", // Only show approved events
        },
        select: {
          id: true,
          name: true,
          date: true,
          time: true,
          type: true,
          description: true,
          location: true,
          organizer: true,
          imageUrl: true,
          maxCapacity: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
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
          _count: {
            select: {
              event_registrations: true,
            },
          },
        },
      }),

      // Get user's registration for this event (only if authenticated)
      isAuthenticated
        ? prisma.event_registrations.findUnique({
            where: {
              registered_user_id_event_id: {
                registered_user_id: userId,
                event_id: eventId,
              },
            },
            select: {
              id: true,
            },
          })
        : Promise.resolve(null),
    ]);

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not approved.",
      });
    }

    console.log(
      `Found approved event: ${event.name} for ${
        isAuthenticated ? userRole : "public"
      }`
    );

    // Check registration status
    const isRegistered = isAuthenticated ? !!userRegistration : null;
    const registeredCount = isAuthenticated
      ? event._count.event_registrations
      : null;

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
      maxCapacity: event.maxCapacity,
      status: event.status,
      isRegistered: isRegistered,
      registeredCount: registeredCount,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.user.id,
        fullName: event.user.fullName,
        email: event.user.email,
        role: event.user.role,
        photoUrl: event.user.photoUrl,
        department: event.user.department,
      },
    };

    const responseData = {
      event: formattedEvent,
      metadata: isAuthenticated
        ? {
            canEdit: event.userId === userId || userRole === "faculty",
            canDelete: event.userId === userId || userRole === "faculty",
            viewerRole: userRole,
            isCreator: event.userId === userId,
            isAuthenticated: true,
          }
        : {
            canEdit: false,
            canDelete: false,
            viewerRole: "public",
            isCreator: false,
            isAuthenticated: false,
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
        message: "Event not found or not approved.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event",
      error: error.message,
    });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    // Check if user is authenticated
    const userId = req.user?.id || null;
    const userRole = req.user?.role || null;
    const isAuthenticated = !!userId;

    // For authenticated users, check permissions (commented out as in original)
    // if (isAuthenticated && !["faculty", "alumni", "admin", "student"].includes(userRole)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. You do not have permission to view events.",
    //   });
    // }

    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Use transaction for consistency and combine queries
    const [totalEvents, events, userRegistrations] = await Promise.all([
      // Get total count
      prisma.event.count({
        where: {
          status: "approved",
        },
      }),

      // Get events with minimal data
      prisma.event.findMany({
        where: {
          status: "approved",
        },
        orderBy: {
          date: "asc",
        },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          date: true,
          time: true,
          type: true,
          description: true,
          location: true,
          organizer: true,
          imageUrl: true,
          maxCapacity: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              photoUrl: true,
            },
          },
          _count: {
            select: {
              event_registrations: true,
            },
          },
        },
      }),

      isAuthenticated
        ? prisma.event_registrations.findMany({
            where: {
              registered_user_id: userId,
              events: {
                status: "approved",
              },
            },
            skip,
            take: pageSize,
            select: {
              event_id: true,
            },
          })
        : Promise.resolve([]),
    ]);

    console.log(
      `Found ${events.length} approved events out of ${totalEvents} total for ${
        isAuthenticated ? userRole : "public"
      }`
    );

    const userRegisteredEventIds = new Set(
      userRegistrations.map((reg) => reg.event_id)
    );

    // Format the response data
    const formattedEvents = events.map((event) => {
      const isRegistered = isAuthenticated
        ? userRegisteredEventIds.has(event.id)
        : null;
      const registeredCount = isAuthenticated
        ? event._count.event_registrations
        : null;

      return {
        id: event.id,
        name: event.name,
        date: event.date,
        time: event.time,
        type: event.type,
        description: event.description,
        location: event.location,
        organizer: event.organizer,
        imageUrl: event.imageUrl,
        maxCapacity: event.maxCapacity,
        status: event.status,
        isRegistered: isRegistered,
        registeredCount: registeredCount,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        createdBy: {
          id: event.user.id,
          fullName: event.user.fullName,
          email: event.user.email,
          role: event.user.role,
          photoUrl: event.user.photoUrl,
        },
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalEvents / pageSize);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      message: "Approved events retrieved successfully",
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
        metadata: {
          isAuthenticated: isAuthenticated,
          viewerRole: userRole || "public",
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
export const searchEvents = async (req, res) => {
  try {
    // Check if user is authenticated
    const userId = req.user?.id || null;
    const userRole = req.user?.role || null;
    const isAuthenticated = !!userId;

    console.log("user: " + (userId || "public"));

    const {
      page = 1,
      limit = 10,
      search = "",
      department = "",
      type = "",
      sortBy = "date",
      sortOrder = "asc",
    } = req.query;

    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Valid departments
    const validDepartments = ["CSE", "MECH", "Civil", "EEE", "IT", "EC", "MCA"];

    // Build where clause for filtering - always include approved status
    const whereClause = {
      status: "approved", // Only show approved events
    };

    // Search functionality - search in name, description, location, organizer
    if (search && search.trim()) {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { location: { contains: search.trim(), mode: "insensitive" } },
        { organizer: { contains: search.trim(), mode: "insensitive" } },
        { type: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    // Department filter
    if (department && validDepartments.includes(department.toUpperCase())) {
      whereClause.user = {
        department: { equals: department.toUpperCase(), mode: "insensitive" },
      };
    }

    // Event type filter
    if (type && type.trim()) {
      whereClause.type = { contains: type.trim(), mode: "insensitive" };
    }

    console.log("Search filters applied (approved events only):", {
      search: search.trim(),
      department: department.toUpperCase(),
      type: type.trim(),
      sortBy,
      sortOrder,
      viewer: isAuthenticated ? userRole : "public",
    });

    // Build orderBy clause
    const orderBy = {};
    const validSortFields = ["date", "createdAt", "name", "type"];
    const validSortOrders = ["asc", "desc"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder.toLowerCase())
    ) {
      orderBy[sortBy] = sortOrder.toLowerCase();
    } else {
      orderBy.date = "asc"; // default sorting
    }

    // Execute queries in parallel
    const [totalEvents, events, userRegistrations] = await Promise.all([
      // Get total count for pagination with filters - only approved events
      prisma.event.count({
        where: whereClause,
      }),

      prisma.event.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          date: true,
          time: true,
          type: true,
          description: true,
          location: true,
          organizer: true,
          imageUrl: true,
          maxCapacity: true,
          status: true,
          createdAt: true,
          updatedAt: true,
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
          _count: {
            select: {
              event_registrations: true,
            },
          },
        },
      }),

      isAuthenticated
        ? prisma.event_registrations.findMany({
            where: {
              registered_user_id: userId,
              events: {
                status: "approved",
                ...whereClause,
              },
            },
            skip,
            take: pageSize,
            select: {
              event_id: true,
            },
          })
        : Promise.resolve([]),
    ]);

    console.log(
      `Found ${
        events.length
      } approved events out of ${totalEvents} total matching the search criteria for ${
        isAuthenticated ? userRole : "public"
      }`
    );

    const userRegisteredEventIds = new Set(
      userRegistrations.map((reg) => reg.event_id)
    );

    const formattedEvents = events.map((event) => {
      const isRegistered = isAuthenticated
        ? userRegisteredEventIds.has(event.id)
        : null;
      const registeredCount = isAuthenticated
        ? event._count.event_registrations
        : null;

      return {
        id: event.id,
        name: event.name,
        date: event.date,
        time: event.time,
        type: event.type,
        description: event.description,
        location: event.location,
        organizer: event.organizer,
        imageUrl: event.imageUrl,
        maxCapacity: event.maxCapacity,
        status: event.status,
        isRegistered: isRegistered,
        registeredCount: registeredCount,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        createdBy: {
          id: event.user.id,
          fullName: event.user.fullName,
          email: event.user.email,
          role: event.user.role,
          photoUrl: event.user.photoUrl,
          department: event.user.department,
        },
      };
    });

    const totalPages = Math.ceil(totalEvents / pageSize);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      message:
        totalEvents === 0
          ? "No approved events found matching your criteria"
          : "Approved events retrieved successfully",
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
        filters: {
          search: search.trim(),
          department: department.toUpperCase() || null,
          type: type.trim() || null,
          sortBy,
          sortOrder: sortOrder.toLowerCase(),
          validDepartments,
        },
        metadata: {
          isAuthenticated: isAuthenticated,
          viewerRole: userRole || "public",
        },
      },
    });
  } catch (error) {
    console.error("Error in searchEvents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search events",
      error: error.message,
    });
  }
};
