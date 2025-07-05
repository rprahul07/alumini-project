import prisma from "../../lib/prisma.js";

// Create a new job posting (alumni only)
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can create jobs.",
        error: "Insufficient permissions",
      });
    }
    const { companyName, jobTitle, description } = req.body;
    if (!companyName || !jobTitle || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide companyName, jobTitle, and description.",
      });
    }
    const job = await prisma.job.create({
      data: {
        userId: req.user.id,
        companyName,
        jobTitle,
        description,
        status: "pending", // All jobs start as pending
      },
    });
    return res.status(201).json({
      success: true,
      message: "Job created successfully. Awaiting admin approval.",
      data: job,
    });
  } catch (error) {
    console.error("Error in createJob:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// Get all approved jobs (public, paginated)
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
    const [totalJobs, jobs] = await Promise.all([
      prisma.job.count({ where: { status: "approved" } }),
      prisma.job.findMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
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
      }),
    ]);
    console.log(jobs);
    return res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      data: {
        jobs,
        total: totalJobs,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(totalJobs / pageSize),
      },
    });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve jobs",
      error: error.message,
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/job/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({ success: true, message: "Job retrieved successfully", data: job });
  } catch (error) {
    console.error("Error in getJobById:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve job", error: error.message });
  }
};

// @desc    Update a job
// @route   PATCH /api/job/:id
// @access  Private (Owner or Admin)
const updateJob = async (req, res) => {
  const { companyName, jobTitle, description } = req.body;
    const jobId = parseInt(req.params.id);

    try {
      const job = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });

      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      // Check if the authenticated user is the job owner or an admin
      if (job.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update your own jobs or be an admin.",
          error: "Insufficient permissions",
        });
      }

      const updatedJob = await prisma.job.update({
        where: {
          id: jobId,
      },
      data: {
        companyName: companyName || job.companyName,
        jobTitle: jobTitle || job.jobTitle,
        description: description || job.description,
      },
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a job
// @route   DELETE /api/job/:id
// @access  Private (Owner or Admin)
const deleteJob = async (req, res) => {
  const jobId = parseInt(req.params.id);

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the authenticated user is the job owner or an admin
    if (job.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own jobs or be an admin.",
        error: "Insufficient permissions",
      });
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    res.status(200).json({ message: "Job removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update job status (Admin only)
// @route   PATCH /api/job/:id/status
// @access  Private (Admin)
const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const jobId = parseInt(req.params.id);

  if (!status || !['pending', 'approved', 'rejected', 'expired'].includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Invalid status provided. Must be one of: pending, approved, rejected, expired' });
  }

  try {
    // Only admin can update job status
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can update job status.",
        error: "Insufficient permissions",
      });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        status: status.toLowerCase(),
      },
    });

    return res.status(200).json({ success: true, message: "Job status updated successfully", data: updatedJob });
  } catch (error) {
    console.error("Error in updateJobStatus:", error);
    return res.status(500).json({ success: false, message: "Failed to update job status", error: error.message });
  }
};

export {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus
};
