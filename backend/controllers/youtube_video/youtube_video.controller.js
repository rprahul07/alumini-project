import prisma from "../../lib/prisma.js";

// Create YouTube Video
export const createYoutubeVideo = async (req, res) => {
  try {
    const { videoUrl, description } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { admin: true },
    });
    if (!user || user.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    // Validation
    if (!videoUrl || videoUrl.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Video URL is required",
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Description is required",
      });
    }

    // Optional: Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      return res.status(400).json({
        success: false,
        error: "Invalid YouTube URL format",
      });
    }

    const newVideo = await prisma.youtubeVideo.create({
      data: {
        videoUrl: videoUrl.trim(),
        description: description.trim(),
      },
    });

    res.status(201).json({
      success: true,
      data: newVideo,
      message: "YouTube video added successfully",
    });
  } catch (err) {
    console.error("Error creating YouTube video:", err);
    res.status(500).json({
      success: false,
      error: "Error creating YouTube video",
    });
  }
};

// Edit YouTube Video
export const editYoutubeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl, description } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { admin: true },
    });
    if (!user || user.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }
    // Validation
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Video ID is required",
      });
    }

    // Check if video exists
    const existingVideo = await prisma.youtubeVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({
        success: false,
        error: "YouTube video not found",
      });
    }

    // Validate at least one field is provided
    if (!videoUrl && !description) {
      return res.status(400).json({
        success: false,
        error:
          "At least one field (videoUrl or description) is required for update",
      });
    }

    // Prepare update data
    const updateData = {};

    if (videoUrl) {
      if (videoUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Video URL cannot be empty",
        });
      }

      // Optional: Validate YouTube URL format
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!youtubeRegex.test(videoUrl)) {
        return res.status(400).json({
          success: false,
          error: "Invalid YouTube URL format",
        });
      }

      updateData.videoUrl = videoUrl.trim();
    }

    if (description) {
      if (description.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Description cannot be empty",
        });
      }
      updateData.description = description.trim();
    }

    const updatedVideo = await prisma.youtubeVideo.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedVideo,
      message: "YouTube video updated successfully",
    });
  } catch (err) {
    console.error("Error updating YouTube video:", err);
    res.status(500).json({
      success: false,
      error: "Error updating YouTube video",
    });
  }
};

// Delete YouTube Video
export const deleteYoutubeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { admin: true },
    });
    if (!user || user.role !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }
    // Validation
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Video ID is required",
      });
    }

    // Check if video exists
    const existingVideo = await prisma.youtubeVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({
        success: false,
        error: "YouTube video not found",
      });
    }

    await prisma.youtubeVideo.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "YouTube video deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting YouTube video:", err);
    res.status(500).json({
      success: false,
      error: "Error deleting YouTube video",
    });
  }
};

export const getAllYoutubeVideos = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalVideos = await prisma.youtubeVideo.count();

    // Fetch paginated videos
    const videos = await prisma.youtubeVideo.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalVideos / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      data: videos,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalVideos: totalVideos,
        limit: limit,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
      },
    });
  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    res.status(500).json({
      success: false,
      error: "Error fetching YouTube videos",
    });
  }
};
