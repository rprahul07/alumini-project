import { createResponse } from "../../utils/response.utils.js";
import prisma from "../../lib/prisma.js";
import { sendEmailToAlumni } from "../../utils/sendEmail.js";

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
    
    const { companyName, jobTitle, description, deadline, registrationType, registrationLink, getEmailNotification } = req.body;
    
    if (!companyName || !jobTitle || !description || !registrationType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide companyName, jobTitle, description, and registrationType.",
      });
    }

    if (registrationType === "external" && !registrationLink) {
      return res.status(400).json({
        success: false,
        message: "For external registration, a registrationLink is required.",
      });
    }

    if (registrationType === "internal" && typeof getEmailNotification === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "For internal registration, getEmailNotification preference is required.",
      });
    }

    const job = await prisma.job.create({
      data: {
        userId: req.user.id,
        companyName,
        jobTitle,
        description,
        deadline: deadline ? new Date(deadline) : null,
        registrationType,
        registrationLink: registrationType === "external" ? registrationLink : null,
        getEmailNotification: registrationType === "internal" ? getEmailNotification : null,
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

// @desc    Register for a job
// @route   POST /api/job/:id/register
// @access  Private (Authenticated User)
const registerJob = async (req, res) => {
  console.log("Registring...")
  const jobId = parseInt(req.params.id);
  const userId = req.user.id;
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.registrationType === "external") {
      return res.status(200).json({
        success: true,
        message: "Redirecting to external registration link",
        data: { registrationLink: job.registrationLink },
      });
    } else if (job.registrationType === "internal") {
      // Check if user already registered
      const existingRegistration = await prisma.jobRegistration.findUnique({
        where: {
          jobId_userId: {
            jobId: jobId,
            userId: userId,
          },
        },
      });

      if (existingRegistration) {
        return res.status(409).json({ success: false, message: "You have already registered for this job." });
      }

      const { name, email, phoneNumber, highestQualification, passoutYear, degreeSpecialization, currentJobTitle, totalExperience, linkedInProfile } = req.body;

      // Fetch user data from the database to ensure we have the latest and complete profile
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        linkedinUrl: true,
      }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const registrationData = {
        jobId: jobId,
        userId: userId,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        highestQualification: highestQualification,
        passoutYear: passoutYear,
        degreeSpecialization: degreeSpecialization,
        currentJobTitle: currentJobTitle,
        totalExperience: totalExperience,
        linkedInProfile: linkedInProfile,
      };

      const jobRegistration = await prisma.jobRegistration.create({
        data: registrationData,
      });

      if (job.getEmailNotification) {
        const applicant = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
            linkedinUrl: true,
          },
        });

        // Send email to job poster
        // This part requires an email sending utility (e.g., sendEmail.js)
        // For now, we'll just log it.
        console.log(`Sending email to ${job.user.email} (${job.user.fullName}) about new applicant:`);
        console.log(`Applicant Name: ${applicant.fullName}`);
        console.log(`Applicant Email: ${applicant.email}`);
        console.log(`Applicant Phone: ${applicant.phoneNumber || 'N/A'}`);
        console.log(`Applicant LinkedIn: ${applicant.linkedinUrl || 'N/A'}`);

        const emailSubject = `New Applicant for your Job: ${job.title}`;
        const emailBody = `
          <p>Dear ${job.user.fullName},</p>
          <p>A new applicant has registered for your job posting: <b>${job.title}</b>.</p>
          <p>Here are the applicant's details:</p>
          <ul>
            <li><b>Name:</b> ${name}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Phone Number:</b> ${phoneNumber || 'N/A'}</li>
            <li><b>Highest Qualification:</b> ${highestQualification || 'N/A'}</li>
            <li><b>Passout Year:</b> ${passoutYear || 'N/A'}</li>
            <li><b>Degree/Specialization:</b> ${degreeSpecialization || 'N/A'}</li>
            <li><b>Current Job Title:</b> ${currentJobTitle || 'N/A'}</li>
            <li><b>Total Experience:</b> ${totalExperience !== undefined && totalExperience !== null ? totalExperience + ' years' : 'N/A'}</li>
            <li><b>LinkedIn Profile:</b> ${linkedInProfile ? `<a href="${linkedInProfile}">${linkedInProfile}</a>` : 'N/A'}</li>
          </ul>
          <p>Thank you,</p>
          <p>The Alumni Network Team</p>
        `;

        await sendEmailToAlumni({
          to: job.user.email,
          subject: emailSubject,
          body: emailBody,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Successfully registered for the job.",
        data: jobRegistration,
      });
    }
  } catch (error) {
    console.error("Error in registerJob:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register for job",
      error: error.message,
    });
  }
};

// @desc    Get user data for job registration pre-fill
// @route   GET /api/job/register/prefill
// @access  Private (Authenticated User)
const getJobRegistrationPrefillData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        linkedinUrl: true,
        totalExperience: true,
        highestQualification: true,
         role: true,
         alumni: {
           select: {
             currentJobTitle: true,
             graduationYear: true,
           },
         },
         student: {
           select: {
             graduationYear: true,
           },
         },
         department: true,
         linkedinUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const prefillData = {
      name: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      highestQualification: user.highestQualification,
       passoutYear: user.role === 'alumni' && user.alumni ? user.alumni.graduationYear : user.student ? user.student.graduationYear : null,
       linkedInProfile: user.linkedinUrl,
       currentJobTitle: user.role === 'alumni' && user.alumni ? user.alumni.currentJobTitle : 'Fresher',
       totalExperience: user.role === 'alumni' && user.alumni ? user.alumni.totalExperience : null,
       department: user.department,
    };

    return res.status(200).json({
      success: true,
      message: "User data for pre-fill retrieved successfully.",
      data: prefillData,
    });
  } catch (error) {
    console.error("Error in getJobRegistrationPrefillData:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pre-fill data",
      error: error.message,
    });
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
  updateJobStatus,
  registerJob,
  getJobRegistrationPrefillData,
};
