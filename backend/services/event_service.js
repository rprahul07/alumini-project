import prisma from "../lib/prisma.js";

export const createEventForUser = async (userId, userRole, eventData) => {
  try {
    console.log("Creating event for user ID:", userId, "with role:", userRole);

    if (!["faculty", "alumni", "admin"].includes(userRole)) {
      return {
        success: false,
        statusCode: 403,
        message:
          "Access denied. Only faculty and alumni and admin can create events.",
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
      maxCapacity,
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
    const parsedMaxCapacity = parseInt(maxCapacity);
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
        maxCapacity: parsedMaxCapacity || null,
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
      maxCapacity: newEvent.maxCapacity,
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
        maxCapacity: true,
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
      maxCapacity,
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

    if (maxCapacity !== undefined) {
      updateData.maxCapacity = parseInt(maxCapacity) || null;
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
      maxCapacity: updatedEvent.maxCapacity,
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
export const removeUserFromEvent = async (
  organizerUserId,
  organizerRole,
  eventId,
  userIdToRemove
) => {
  try {
    console.log(
      "Removing user ID:",
      userIdToRemove,
      "from event ID:",
      eventId,
      "by organizer ID:",
      organizerUserId
    );

    // Validate event ID
    const eventIdInt = parseInt(eventId);
    if (!eventId || isNaN(eventIdInt)) {
      throw new Error("Invalid event ID provided.");
    }

    // Validate user ID to remove
    const userIdToRemoveInt = parseInt(userIdToRemove);
    if (!userIdToRemove || isNaN(userIdToRemoveInt)) {
      throw new Error("Invalid user ID provided.");
    }

    // Check if the event exists and user has permission (optimized query)
    const whereClause =
      organizerRole === "admin"
        ? { id: eventIdInt } // Admin can access any event
        : { id: eventIdInt, userId: organizerUserId }; // Others can only access their own events

    const event = await prisma.event.findUnique({
      where: whereClause,
      select: {
        id: true,
        name: true,
        userId: true,
        status: true,
        date: true,
        time: true,
        location: true,
        maxCapacity: true,
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        _count: {
          select: {
            event_registrations: true,
          },
        },
      },
    });

    // Check if event exists and user has permission
    if (!event) {
      throw new Error(
        "Event not found or you don't have permission to remove users from this event."
      );
    }

    // Check if the user to be removed is actually registered for the event
    const existingRegistration = await prisma.event_registrations.findUnique({
      where: {
        registered_user_id_event_id: {
          registered_user_id: userIdToRemoveInt,
          event_id: eventIdInt,
        },
      },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!existingRegistration) {
      throw new Error("User is not registered for this event.");
    }

    // Prevent removing users from past events (optional business rule)
    if (new Date(event.date) < new Date()) {
      throw new Error("Cannot remove users from past events.");
    }

    // Remove the registration
    await prisma.event_registrations.delete({
      where: {
        registered_user_id_event_id: {
          registered_user_id: userIdToRemoveInt,
          event_id: eventIdInt,
        },
      },
    });

    // Get updated event data with new registration count
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
        _count: {
          select: {
            event_registrations: true,
          },
        },
      },
    });

    // Log the activity for the organizer
    await prisma.activityLog.create({
      data: {
        userId: organizerUserId,
        action: "USER_REMOVED_FROM_EVENT",
        details: {
          eventId: updatedEvent.id,
          eventName: updatedEvent.name,
          removedUserId: userIdToRemoveInt,
          removedUserName: existingRegistration.users.fullName,
          removedUserEmail: existingRegistration.users.email,
          removedUserRole: existingRegistration.users.role,
          registrationId: existingRegistration.id,
          newRegistrationCount: updatedEvent._count.event_registrations,
        },
        userType: organizerRole,
      },
    });

    // Also log activity for the user who was removed (for their records)
    await prisma.activityLog.create({
      data: {
        userId: userIdToRemoveInt,
        action: "REMOVED_FROM_EVENT",
        details: {
          eventId: updatedEvent.id,
          eventName: updatedEvent.name,
          removedBy: organizerUserId,
          removedByRole: organizerRole,
          registrationId: existingRegistration.id,
        },
        userType: existingRegistration.users.role,
      },
    });

    console.log(
      `User ${existingRegistration.users.fullName} (ID: ${userIdToRemoveInt}) removed from event: ${updatedEvent.name} by organizer ${organizerUserId}`
    );

    // Return success response
    return {
      success: true,
      message: "User successfully removed from the event",
      data: {
        eventId: updatedEvent.id,
        eventName: updatedEvent.name,
        eventDate: updatedEvent.date,
        eventTime: updatedEvent.time,
        eventLocation: updatedEvent.location,
        removedUser: {
          id: existingRegistration.users.id,
          fullName: existingRegistration.users.fullName,
          email: existingRegistration.users.email,
          role: existingRegistration.users.role,
        },
        registrationId: existingRegistration.id,
        newRegistrationCount: updatedEvent._count.event_registrations,
        maxCapacity: updatedEvent.maxCapacity,
        availableSpots: updatedEvent.maxCapacity
          ? updatedEvent.maxCapacity - updatedEvent._count.event_registrations
          : null,
      },
    };
  } catch (error) {
    console.error("Error in removeUserFromEvent:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        message: "Registration not found or already removed",
        error: "Registration not found",
      };
    }

    // Return error response
    return {
      success: false,
      message: error.message || "Failed to remove user from event",
      error: error.code || error.message,
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
export const getRegisteredEvents = async (userId, userRole) => {
  try {
    console.log(
      "Fetching registered events for user ID:",
      userId,
      "with role:",
      userRole
    );

    // Validate user ID
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error("Invalid user ID provided.");
    }

    // Fetch only upcoming event registrations for the user with event details
    const registrations = await prisma.event_registrations.findMany({
      where: {
        registered_user_id: userId,
        events: {
          date: {
            gte: new Date(), // Only get events with date >= today
          },
        },
      },
      select: {
        id: true,
        registered_at: true,
        events: {
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
            status: true,
            maxCapacity: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                event_registrations: true,
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        events: {
          date: "asc", // Order by event date (upcoming events first)
        },
      },
    });

    // Transform the data to a more user-friendly format
    const upcomingEvents = registrations.map((registration) => ({
      registrationId: registration.id,
      registeredAt: registration.registered_at,
      eventId: registration.events.id,
      eventName: registration.events.name,
      eventDate: registration.events.date,
      eventTime: registration.events.time,
      eventType: registration.events.type,
      description: registration.events.description,
      location: registration.events.location,
      organizer: registration.events.organizer,
      imageUrl: registration.events.imageUrl,
      status: registration.events.status,
      maxCapacity: registration.events.maxCapacity,
      currentRegistrations: registration.events._count.event_registrations,
      createdAt: registration.events.createdAt,
      updatedAt: registration.events.updatedAt,
      eventCreator: {
        id: registration.events.user.id,
        name: registration.events.user.fullName,
      },
      // Add some useful computed fields
      availableSpots: registration.events.maxCapacity
        ? registration.events.maxCapacity -
          registration.events._count.event_registrations
        : null,
    }));

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: "REGISTERED_EVENTS_VIEWED",
        details: {
          totalUpcomingRegistrations: registrations.length,
        },
        userType: userRole,
      },
    });

    console.log(
      `Fetched ${registrations.length} upcoming registered events for user ${userId}`
    );

    // Return success response data
    return {
      success: true,
      message: "Successfully fetched upcoming registered events",
      data: {
        totalRegistrations: registrations.length,
        events: upcomingEvents,
      },
    };
  } catch (error) {
    console.error("Error in getRegisteredEvents:", error);

    // Return error response data
    return {
      success: false,
      message: error.message || "Failed to fetch registered events",
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

    const eventIdInt = parseInt(eventId);
    if (!eventId || isNaN(eventIdInt)) {
      throw new Error("Invalid event ID provided.");
    }

    // Check if user is already registered
    const existingRegistration = await prisma.event_registrations.findUnique({
      where: {
        registered_user_id_event_id: {
          registered_user_id: userId,
          event_id: eventIdInt,
        },
      },
    });

    if (existingRegistration) {
      throw new Error("You are already registered for this event.");
    }

    // Fetch the event to check its status and capacity
    const event = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        status: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
        _count: {
          select: {
            event_registrations: true,
          },
        },
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

    // Check capacity limit
    if (
      event.maxCapacity &&
      event._count.event_registrations >= event.maxCapacity
    ) {
      throw new Error("Event is at full capacity.");
    }

    // Register user by creating a new event registration
    const newRegistration = await prisma.event_registrations.create({
      data: {
        registered_user_id: userId,
        event_id: eventIdInt,
      },
    });

    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
        _count: {
          select: {
            event_registrations: true,
          },
        },
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
          registrationId: newRegistration.id,
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
        registrationId: newRegistration.id,
        eventId: updatedEvent.id,
        eventName: updatedEvent.name,
        eventDate: updatedEvent.date,
        eventTime: updatedEvent.time,
        eventLocation: updatedEvent.location,
        registeredCount: updatedEvent._count.event_registrations,
        maxCapacity: updatedEvent.maxCapacity,
        registeredAt: newRegistration.registered_at,
      },
    };
  } catch (error) {
    console.error("Error in registerForEvents:", error);

    // Handle unique constraint violation (duplicate registration)
    if (error.code === "P2002") {
      return {
        success: false,
        message: "You are already registered for this event",
        error: "Duplicate registration",
      };
    }

    // Return error response data (not HTTP response)
    return {
      success: false,
      message: error.message || "Failed to register for event",
      error: error.code === "P2025" ? "Event not found" : error.message,
    };
  }
};
export const getEventRegistrations = async (
  organizerUserId,
  eventId = null
) => {
  try {
    console.log(
      "Fetching registrations for organizer ID:",
      organizerUserId,
      eventId ? `for event ID: ${eventId}` : "for all events"
    );

    const whereClause = {
      userId: organizerUserId,
      status: "approved",
    };

    if (eventId) {
      const eventIdInt = parseInt(eventId);
      if (isNaN(eventIdInt)) {
        throw new Error("Invalid event ID provided.");
      }
      whereClause.id = eventIdInt;
    }

    const eventsWithRegistrations = await prisma.event.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        date: true,
        time: true,
        location: true,
        type: true,
        maxCapacity: true,
        description: true,
        event_registrations: {
          select: {
            id: true,
            registered_at: true,
            users: {
              select: {
                id: true,
                fullName: true,
                department: true,
                role: true,
                photoUrl: true,
                bio: true,
                student: {
                  select: {
                    rollNumber: true,
                    currentSemester: true,
                    graduationYear: true,
                    batch_startYear: true,
                    batch_endYear: true,
                  },
                },
                alumni: {
                  select: {
                    graduationYear: true,
                    course: true,
                    currentJobTitle: true,
                    companyName: true,
                    company_role: true,
                  },
                },
                faculty: {
                  select: {
                    designation: true,
                  },
                },
              },
            },
          },
          orderBy: {
            registered_at: "asc",
          },
        },
        _count: {
          select: {
            event_registrations: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!eventsWithRegistrations || eventsWithRegistrations.length === 0) {
      const message = eventId
        ? "Event not found or you don't have permission to view its registrations."
        : "No approved events found for this organizer.";

      return {
        success: true,
        message,
        data: {
          events: [],
          totalEvents: 0,
          totalRegistrations: 0,
        },
      };
    }

    const formattedEvents = eventsWithRegistrations.map((event) => ({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventType: event.type,
      eventDescription: event.description,
      maxCapacity: event.maxCapacity,
      totalRegistrations: event._count.event_registrations,
      registeredUsers: event.event_registrations.map((registration) => ({
        registrationId: registration.id,
        registeredAt: registration.registered_at,
        userId: registration.users.id,
        fullName: registration.users.fullName,
        department: registration.users.department,
        role: registration.users.role,
        photoUrl: registration.users.photoUrl,
        bio: registration.users.bio,
        roleDetails:
          registration.users.role === "student"
            ? {
                rollNumber: registration.users.student?.rollNumber,
                currentSemester: registration.users.student?.currentSemester,
                graduationYear: registration.users.student?.graduationYear,
                batchStartYear: registration.users.student?.batch_startYear,
                batchEndYear: registration.users.student?.batch_endYear,
              }
            : registration.users.role === "alumni"
              ? {
                  graduationYear: registration.users.alumni?.graduationYear,
                  course: registration.users.alumni?.course,
                  currentJobTitle: registration.users.alumni?.currentJobTitle,
                  companyName: registration.users.alumni?.companyName,
                  companyRole: registration.users.alumni?.company_role,
                }
              : registration.users.role === "faculty"
                ? {
                    designation: registration.users.faculty?.designation,
                  }
                : null,
      })),
    }));

    // Calculate summary statistics
    const totalRegistrations = formattedEvents.reduce(
      (sum, event) => sum + event.totalRegistrations,
      0
    );

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: organizerUserId,
        action: "VIEW_EVENT_REGISTRATIONS",
        details: {
          eventId: eventId || "all_events",
          totalEventsViewed: formattedEvents.length,
          totalRegistrationsViewed: totalRegistrations,
        },
        userType: "admin", // Assuming organizers have admin-like privileges
      },
    });

    console.log(
      `Retrieved ${formattedEvents.length} events with ${totalRegistrations} total registrations for organizer ${organizerUserId}`
    );

    return {
      success: true,
      message: "Event registrations retrieved successfully",
      data: {
        events: formattedEvents,
        totalEvents: formattedEvents.length,
        totalRegistrations: totalRegistrations,
        summary: {
          eventsSummary: formattedEvents.map((event) => ({
            eventId: event.eventId,
            eventName: event.eventName,
            registrationCount: event.totalRegistrations,
            maxCapacity: event.maxCapacity,
            capacityPercentage: event.maxCapacity
              ? Math.round((event.totalRegistrations / event.maxCapacity) * 100)
              : null,
          })),
        },
      },
    };
  } catch (error) {
    console.error("Error in getEventRegistrations:", error);

    return {
      success: false,
      message: error.message || "Failed to retrieve event registrations",
      error: error.code || "UNKNOWN_ERROR",
    };
  }
};
export const withdrawFromEvent = async (userId, userRole, eventId) => {
  try {
    console.log(
      "Withdrawing user ID:",
      userId,
      "with role:",
      userRole,
      "from event ID:",
      eventId
    );

    // Validate event ID - convert to integer
    const eventIdInt = parseInt(eventId);
    if (!eventId || isNaN(eventIdInt)) {
      throw new Error("Invalid event ID provided.");
    }

    // Check if user is registered for this event
    const existingRegistration = await prisma.event_registrations.findUnique({
      where: {
        registered_user_id_event_id: {
          registered_user_id: userId,
          event_id: eventIdInt,
        },
      },
    });

    if (!existingRegistration) {
      throw new Error("You are not registered for this event.");
    }

    // Fetch the event to check its status and get event details
    const event = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        status: true,
        date: true,
        time: true,
        location: true,
        _count: {
          select: {
            event_registrations: true,
          },
        },
      },
    });

    // Check if event exists
    if (!event) {
      throw new Error("Event not found.");
    }

    // Check if event date has passed (optional - you might want to allow withdrawal from past events)
    if (new Date(event.date) < new Date()) {
      throw new Error("Cannot withdraw from past events.");
    }

    // Optional: Check if withdrawal is allowed based on event status
    // You might want to prevent withdrawal from certain status events
    if (event.status === "rejected") {
      throw new Error("Cannot withdraw from rejected events.");
    }

    // Delete the registration
    await prisma.event_registrations.delete({
      where: {
        registered_user_id_event_id: {
          registered_user_id: userId,
          event_id: eventIdInt,
        },
      },
    });

    // Get updated event data with new registration count
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventIdInt },
      select: {
        id: true,
        name: true,
        maxCapacity: true,
        date: true,
        time: true,
        location: true,
        _count: {
          select: {
            event_registrations: true,
          },
        },
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: userId,
        action: "EVENT_WITHDRAWAL",
        details: {
          eventId: updatedEvent.id,
          eventName: updatedEvent.name,
          withdrawnAt: new Date(),
        },
        userType: userRole,
      },
    });

    console.log(`User ${userId} withdrew from event: ${updatedEvent.name}`);

    // Return success response data
    return {
      success: true,
      message: "Successfully withdrew from the event",
      data: {
        eventId: updatedEvent.id,
        eventName: updatedEvent.name,
        eventDate: updatedEvent.date,
        eventTime: updatedEvent.time,
        eventLocation: updatedEvent.location,
        remainingRegistrations: updatedEvent._count.event_registrations,
        maxCapacity: updatedEvent.maxCapacity,
        withdrawnAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Error in withdrawFromEvent:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return {
        success: false,
        message: "Registration not found or already withdrawn",
        error: "Registration not found",
      };
    }

    // Return error response data
    return {
      success: false,
      message: error.message || "Failed to withdraw from event",
      error: error.message,
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
        _count: {
          select: {
            event_registrations: true,
          },
        },
        event_registrations: {
          where: {
            registered_user_id: userId,
          },
          select: {
            id: true,
          },
          take: 1,
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
      registeredCount: event._count.event_registrations,
      isRegistered: event.event_registrations.length > 0,
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
