import prisma from "../../lib/prisma.js";

// Create Bookmark
export const createBookmarkForAlumni = async (req, res) => {
  try {
    const userId = req.user.id;
    const userIdParam = parseInt(req.params.alumniId); // This is actually User.id from frontend

    // Find the Alumni record by User.id
    const alumni = await prisma.alumni.findUnique({
      where: { userId: userIdParam }
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found"
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_alumniId: {
          userId,
          alumniId: alumni.id,
        },
      },
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Alumni already bookmarked"
      });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        alumniId: alumni.id, // Use the Alumni.id, not User.id
      },
    });

    return res.status(201).json({
      success: true,
      message: "Bookmark created successfully",
      data: bookmark,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating bookmark",
      error: error.message,
    });
  }
};

// Get all bookmarks for a logged-in user
export const getBookmarksForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { 
        alumni: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                photoUrl: true,
                bio: true,
                department: true,
              }
            }
          }
        }
      },
    });

    return sendResponse(res, 200, true, "Bookmarks fetched successfully", bookmarks);
  } catch (error) {
    return handleError(res, error, "Error fetching bookmarks");
  }
};

// Delete bookmark for a specific alumni by user
export const deleteBookmarkForAlumni = async (req, res) => {
  try {
    const userId = req.user.id;
    const alumni = await findAlumniByUserId(req.params.alumniId);

    const bookmark = await prisma.bookmark.delete({
      where: {
        userId_alumniId: {
          userId,
          alumniId: alumni.id,
        },
      },
    });

    return sendResponse(res, 200, true, "Bookmark deleted successfully", bookmark);
  } catch (error) {
    return handleError(res, error, "Error deleting bookmark");
  }
};

// Admin: Get all bookmarks in the system
export const getAllBookmarks = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      include: { alumni: true },
    });

    return res.status(200).json({
      success: true,
      message: "All bookmarks fetched successfully",
      data: bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching all bookmarks",
      error: error.message,
    });
  }
};
