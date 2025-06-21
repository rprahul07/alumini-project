import prisma from "../lib/prisma.js";

export const createEventForUser = async (userId, userRole, eventData) => {
  try {
    console.log("Creating event for user ID:", userId, "with role:", userRole);

    if (!["faculty", "alumni"].includes(userRole)) {
      return {
        success: false,
        statusCode: 403,
        message: "Access denied. Only faculty and alumni can create events.",
      };
    }

    // Extract event data
    const {
      name,
      date,
      time,
      type,
      description,
      location,
      organizer,
      imageUrl,
    } = eventData;

    // Validate required fields
    if (!name || !date || !time || !type || !location || !organizer) {
      return {
        success: false,
        statusCode: 400,
        message:
          "Missing required fields. Please provide name, date, time, type, location, and organizer.",
      };
    }

    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid date format. Please provide a valid date.",
      };
    }

    // Check if the event date is in the future
    if (eventDate < new Date()) {
      return {
        success: false,
        statusCode: 400,
        message: "Event date must be in the future.",
      };
    }

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        userId,
        name: name.trim(),
        date: eventDate,
        time: time.trim(),
        type: type.trim(),
        description: description ? description.trim() : null,
        location: location.trim(),
        organizer: organizer.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
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

    console.log("Event created successfully:", newEvent);

    // Format response data
    const eventResponseData = {
      id: newEvent.id,
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      location: newEvent.location,
      organizer: newEvent.organizer,
      imageUrl: newEvent.imageUrl,
      status: newEvent.status,
      createdAt: newEvent.createdAt,
      createdBy: {
        id: newEvent.user.id,
        fullName: newEvent.user.fullName,
        email: newEvent.user.email,
        role: newEvent.user.role,
      },
    };

    return {
      success: true,
      statusCode: 201,
      message: "Event created successfully",
      data: eventResponseData,
    };
  } catch (error) {
    console.error("Error in createEventForUser:", error);

    // Handle Prisma specific errors
    if (error.code === "P2002") {
      return {
        success: false,
        statusCode: 400,
        message: "A conflict occurred while creating the event.",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to create event",
      error: error.message,
    };
  }
};
export const editEventForUser = async (
  userId,
  userRole,
  eventId,
  eventData
) => {
  try {
    console.log(
      "Editing event ID:",
      eventId,
      "for user ID:",
      userId,
      "with role:",
      userRole
    );

    if (!["faculty", "alumni"].includes(userRole)) {
      return {
        success: false,
        statusCode: 403,
        message: "Access denied. Only faculty and alumni can edit events.",
      };
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid event ID provided.",
      };
    }

    // Check if the event exists and if the user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
        name: true,
        date: true,
        time: true,
        type: true,
        description: true,
        location: true,
        organizer: true,
        imageUrl: true,
      },
    });

    if (!existingEvent) {
      return {
        success: false,
        statusCode: 404,
        message: "Event not found.",
      };
    }

    // Check if the user is the creator of the event
    if (existingEvent.userId !== userId) {
      return {
        success: false,
        statusCode: 403,
        message: "Access denied. You can only edit events that you created.",
      };
    }

    // Extract event data
    const {
      name,
      date,
      time,
      type,
      description,
      location,
      organizer,
      imageUrl,
    } = eventData;

    // Prepare update data (only include fields that are provided)
    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event name cannot be empty.",
        };
      }
      updateData.name = name.trim();
    }

    if (date !== undefined) {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return {
          success: false,
          statusCode: 400,
          message: "Invalid date format. Please provide a valid date.",
        };
      }

      // Check if the event date is in the future
      if (eventDate < new Date()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event date must be in the future.",
        };
      }

      updateData.date = eventDate;
    }

    if (time !== undefined) {
      if (!time.trim()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event time cannot be empty.",
        };
      }
      updateData.time = time.trim();
    }

    if (type !== undefined) {
      if (!type.trim()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event type cannot be empty.",
        };
      }
      updateData.type = type.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event location cannot be empty.",
        };
      }
      updateData.location = location.trim();
    }

    if (organizer !== undefined) {
      if (!organizer.trim()) {
        return {
          success: false,
          statusCode: 400,
          message: "Event organizer cannot be empty.",
        };
      }
      updateData.organizer = organizer.trim();
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "No valid fields provided for update.",
      };
    }

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
          },
        },
      },
    });

    console.log("Event updated successfully:", updatedEvent);

    // Format response data
    const eventResponseData = {
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
      },
    };

    return {
      success: true,
      statusCode: 200,
      message: "Event updated successfully",
      data: eventResponseData,
    };
  } catch (error) {
    console.error("Error in editEventForUser:", error);

    // Handle Prisma specific errors
    if (error.code === "P2002") {
      return {
        success: false,
        statusCode: 400,
        message: "A conflict occurred while updating the event.",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        statusCode: 404,
        message: "Event not found.",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to update event",
      error: error.message,
    };
  }
};

export const deleteEventForUser = async (userId, userRole, eventId) => {
  try {
    console.log(
      "Deleting event ID:",
      eventId,
      "for user ID:",
      userId,
      "with role:",
      userRole
    );

    // Check if user has permission to delete events (only alumni and faculty)
    if (!["faculty", "alumni"].includes(userRole)) {
      return {
        success: false,
        statusCode: 403,
        message: "Access denied. Only faculty and alumni can delete events.",
      };
    }

    // Validate event ID
    if (!eventId || isNaN(eventId)) {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid event ID provided.",
      };
    }

    // Check if the event exists and if the user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        userId: true,
        name: true,
        date: true,
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
      return {
        success: false,
        statusCode: 404,
        message: "Event not found.",
      };
    }

    // Check if the user is the creator of the event
    if (existingEvent.userId !== userId) {
      return {
        success: false,
        statusCode: 403,
        message: "Access denied. You can only delete events that you created.",
      };
    }

    // Store event details before deletion for response
    const deletedEventInfo = {
      id: existingEvent.id,
      name: existingEvent.name,
      date: existingEvent.date,
      createdBy: {
        id: existingEvent.user.id,
        fullName: existingEvent.user.fullName,
        email: existingEvent.user.email,
        role: existingEvent.user.role,
      },
    };

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    console.log("Event deleted successfully:", deletedEventInfo);

    return {
      success: true,
      statusCode: 200,
      message: "Event deleted successfully",
      data: deletedEventInfo,
    };
  } catch (error) {
    console.error("Error in deleteEventForUser:", error);

    // Handle Prisma specific errors
    if (error.code === "P2025") {
      return {
        success: false,
        statusCode: 404,
        message: "Event not found or already deleted.",
      };
    }

    // Handle foreign key constraint errors (if there are related records)
    if (error.code === "P2003") {
      return {
        success: false,
        statusCode: 400,
        message: "Cannot delete event due to existing related records.",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to delete event",
      error: error.message,
    };
  }
};
export const registerForEvents = async (userId, userRole, eventId) => {
  try {
    console.log(
      "Registering user ID:",
      userId,
      "with role:",
      userRole,
      "for event ID:",
      eventId
    );

    // Validate event ID - convert to integer
    const eventIdInt = parseInt(eventId);
    if (!eventId || isNaN(eventIdInt)) {
      throw new Error("Invalid event ID provided.");
    }

    // Fetch the event to check its status and capacity
    const event = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        status: true,
        registeredUsers: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
      },
    });

    // Check if event exists
    if (!event) {
      throw new Error("Event not found.");
    }

    // Check if event is approved
    if (event.status !== "approved") {
      throw new Error("Cannot register for events that are not approved.");
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      throw new Error("Cannot register for past events.");
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(userId)) {
      throw new Error("You are already registered for this event.");
    }

    // Check capacity limit
    if (
      event.maxCapacity &&
      event.registeredUsers.length >= event.maxCapacity
    ) {
      throw new Error("Event is at full capacity.");
    }

    // Register user by pushing userId to registeredUsers array
    const updatedEvent = await prisma.event.update({
      where: { id: eventIdInt },
      data: {
        registeredUsers: {
          push: userId,
        },
      },
      select: {
        id: true,
        name: true,
        registeredUsers: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: "EVENT_REGISTERED",
        details: {
          eventId: updatedEvent.id,
          eventName: updatedEvent.name,
        },
        userType: userRole,
      },
    });

    console.log(`User ${userId} registered for event: ${updatedEvent.name}`);

    // Return success response data (not HTTP response)
    return {
      success: true,
      message: "Successfully registered for the event",
      data: {
        eventId: updatedEvent.id,
        eventName: updatedEvent.name,
        eventDate: updatedEvent.date,
        eventTime: updatedEvent.time,
        eventLocation: updatedEvent.location,
        registeredCount: updatedEvent.registeredUsers.length,
        maxCapacity: updatedEvent.maxCapacity,
      },
    };
  } catch (error) {
    console.error("Error in registerForEvents:", error);

    // Return error response data (not HTTP response)
    return {
      success: false,
      message: error.message || "Failed to register for event",
      error: error.code === "P2025" ? "Event not found" : error.message,
    };
  }
};
export const getMyEvents = async (userId, userRole, options = {}) => {
  try {
    console.log(
      "Fetching created events for user ID:",
      userId,
      "with role:",
      userRole
    );

    const { page = 1, limit = 10, status = "all" } = options;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Build where clause to get events created by the user
    const whereClause = {
      userId: userId, // Events created by the user
    };

    if (status !== "all") {
      const validStatuses = ["approved", "pending", "rejected"];
      if (validStatuses.includes(status)) {
        whereClause.status = status;
      }
    }

    // Get total count for pagination
    const totalEvents = await prisma.event.count({
      where: whereClause,
    });

    // Fetch events with pagination
    const events = await prisma.event.findMany({
      where: whereClause,
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
            department: true,
          },
        },
      },
    });

    console.log(
      `Found ${events.length} created events out of ${totalEvents} total for user ${userId}`
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
      maxCapacity: event.maxCapacity,
      registeredCount: event.registeredUsers.length,
      isRegistered: event.registeredUsers.includes(userId),
      isCreator: true, // Always true since we're fetching user's created events
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

    // Categorize events by status and date
    const now = new Date();
    const categorizedEvents = {
      upcoming: formattedEvents.filter(
        (event) => new Date(event.date) > now && event.status === "approved"
      ),
      past: formattedEvents.filter(
        (event) => new Date(event.date) <= now && event.status === "approved"
      ),
      pending: formattedEvents.filter((event) => event.status === "pending"),
      cancelled: formattedEvents.filter((event) => event.status === "rejected"),
      created: formattedEvents.filter((event) => event.isCreator), // Events created by user (all in this case)
    };

    // Return success response data (not HTTP response)
    return {
      success: true,
      message:
        totalEvents === 0
          ? "User hasn't created any events yet"
          : "User's created events retrieved successfully",
      data: {
        events: formattedEvents,
        categorized: categorizedEvents,
        summary: {
          totalCreated: totalEvents,
          upcoming: categorizedEvents.upcoming.length,
          past: categorizedEvents.past.length,
          pending: categorizedEvents.pending.length,
          cancelled: categorizedEvents.cancelled.length,
          created: categorizedEvents.created.length,
        },
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalEvents,
          eventsPerPage: pageSize,
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  } catch (error) {
    console.error("Error in getMyEvents:", error);

    // Return error response data (not HTTP response)
    return {
      success: false,
      message: error.message || "Failed to retrieve user's created events",
      error: error.code === "P2025" ? "No events found" : error.message,
    };
  }
};
