import prisma from "../../lib/prisma.js";

// Create Bookmark
export const createBookmarkForAlumni = async (req, res) => {
  try {
    const userId = req.user.id;
    const alumniId = parseInt(req.params.alumniId);

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        alumniId,
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
      include: { alumni: true },
    });

    return res.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully",
      data: bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookmarks",
      error: error.message,
    });
  }
};

// Delete bookmark for a specific alumni by user
export const deleteBookmarkForAlumni = async (req, res) => {
  try {
    const userId = req.user.id;
    const alumniId = parseInt(req.params.alumniId);

    const bookmark = await prisma.bookmark.delete({
      where: {
        userId_alumniId: {
          userId,
          alumniId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully",
      data: bookmark,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting bookmark",
      error: error.message,
    });
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
