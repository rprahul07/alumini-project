import prisma from "../../lib/prisma.js";

export const getEventById = async (req, res) => {
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

    // Restrict access to faculty and alumni only
    if (!["faculty", "alumni"].includes(userRole)) {
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

    // Fetch the event by ID - only approved events
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        status: "approved", // Only show approved events
      },
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

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not approved.",
      });
    }

    console.log(`Found approved event: ${event.name} for ${userRole}`);

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
      status: event.status,
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

    // Add metadata for permissions
    const responseData = {
      event: formattedEvent,
      metadata: {
        canEdit: event.userId === userId || userRole === "faculty",
        canDelete: event.userId === userId || userRole === "faculty",
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
    // const userId = req.user.id;
    // const userRole = req.user.role;

    // Check if user has permission to view events
    // if (!["faculty", "alumni", "admin", "student"].includes(userRole)) {
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

    // Get total count for pagination - only approved events
    const totalEvents = await prisma.event.count({
      where: {
        status: "approved",
      },
    });

    // Fetch events with pagination - only approved events
    const events = await prisma.event.findMany({
      where: {
        status: "approved",
      },
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
            role: true,
            photoUrl: true,
          },
        },
      },
    });

    console.log(
      `Found ${events.length} approved events out of ${totalEvents} total`
    );

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
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: {
        id: event.user.id,
        fullName: event.user.fullName,
        email: event.user.email,
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
    // const userId = req.user.id;
    // const userRole = req.user.role;

    // Check if user has permission to view events
    // if (!["faculty", "alumni", "admin", "student"].includes(userRole)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. You do not have permission to view events.",
    //   });
    // }

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
    const validDepartments = ["CSE", "MECH", "Civil", "EEE", "IT", "EC"];

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
    });

    // Get total count for pagination with filters - only approved events
    const totalEvents = await prisma.event.count({
      where: whereClause,
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

    // Fetch events with search, filtering, and pagination - only approved events
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: pageSize,
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

    console.log(
      `Found ${events.length} approved events out of ${totalEvents} total matching the search criteria`
    );

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
      status: event.status,
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
    }));

    // Calculate pagination metadata
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
