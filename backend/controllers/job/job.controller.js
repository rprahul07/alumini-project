import { createResponse } from "../../utils/response.utils.js";
import prisma from "../../lib/prisma.js";
import { sendEmailToAlumni } from "../../utils/sendEmail.js";

const createJob = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can create jobs.",
        error: "Insufficient permissions",
      });
    }

    const {
      companyName,
      jobTitle,
      description,
      deadline,
      registrationType,
      registrationLink,
      getEmailNotification,
      jobType,
    } = req.body;

    // Validate required fields
    if (!companyName || !jobTitle || !description || !registrationType) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Please provide companyName, jobTitle, description, and registrationType.",
      });
    }

    // Validate jobType if provided
    if (jobType && !["job", "internship"].includes(jobType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type. Must be either 'job' or 'internship'.",
      });
    }

    // Validate external registration requirements
    if (registrationType === "external" && !registrationLink) {
      return res.status(400).json({
        success: false,
        message: "For external registration, a registrationLink is required.",
      });
    }

    // Validate internal registration requirements
    if (
      registrationType === "internal" &&
      typeof getEmailNotification === "undefined"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "For internal registration, getEmailNotification preference is required.",
      });
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        userId: req.user.id,
        companyName,
        jobTitle,
        description,
        deadline: deadline ? new Date(deadline) : null,
        registrationType,
        registrationLink:
          registrationType === "external" ? registrationLink : null,
        getEmailNotification:
          registrationType === "internal" ? getEmailNotification : null,
        status: "pending",
        type: jobType || "job", // Default to "job" if not provided
      },
    });

    return res.status(201).json({
      success: true,
      message: `${jobType === "internship" ? "Internship" : "Job"} created successfully. Awaiting admin approval.`,
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

const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", jobType } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const searchFilter = search
      ? {
          OR: [
            {
              companyName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              jobTitle: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const jobTypeFilter =
      jobType && ["job", "internship"].includes(jobType.toLowerCase())
        ? { type: jobType.toLowerCase() }
        : {};

    const whereClause = {
      status: "approved",
      ...searchFilter,
      ...jobTypeFilter,
    };

    const [totalJobs, jobs] = await Promise.all([
      prisma.job.count({ where: whereClause }),
      prisma.job.findMany({
        where: whereClause,
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

const getJobById = async (req, res) => {
  const jobId = parseInt(req.params.id);
  if (!jobId) {
    return res.status(400).json({ success: false, message: "Job ID is required" });
  }
  try {
    let userSelect = { fullName: true };
    if (req.user.role === 'admin') {
      userSelect = { ...userSelect, email: true, phoneNumber: true, alumni: { select: { companyName: true, currentJobTitle: true } } };
    } else if (req.user.role === 'alumni' || req.user.role === 'student') {
      userSelect = {
        ...userSelect,
        alumni: { select: { companyName: true, currentJobTitle: true } }
      };
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { user: { select: userSelect } }
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Job retrieved successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error in getJobById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve job",
      error: error.message,
    });
  }
};

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
        message:
          "Access denied. You can only update your own jobs or be an admin.",
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
        message:
          "Access denied. You can only delete your own jobs or be an admin.",
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
  console.log("Registering...")
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

      // Create simple registration record
      const jobRegistration = await prisma.jobRegistration.create({
        data: {
          jobId: jobId,
          userId: userId,
        },
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
        console.log(`Sending email to ${job.user.email} (${job.user.fullName}) about new applicant:`);
        console.log(`Applicant Name: ${applicant.fullName}`);
        console.log(`Applicant Email: ${applicant.email}`);
        console.log(`Applicant Phone: ${applicant.phoneNumber || 'N/A'}`);
        console.log(`Applicant LinkedIn: ${applicant.linkedinUrl || 'N/A'}`);

        const emailSubject = `New Applicant for your Job: ${job.jobTitle}`;
        const emailBody = `
          <p>Dear ${job.user.fullName},</p>
          <p>A new applicant has registered for your job posting: <b>${job.jobTitle}</b>.</p>
          <p>Here are the applicant's details:</p>
          <ul>
            <li><b>Name:</b> ${applicant.fullName}</li>
            <li><b>Email:</b> ${applicant.email}</li>
            <li><b>Phone Number:</b> ${applicant.phoneNumber || 'N/A'}</li>
            <li><b>LinkedIn Profile:</b> ${applicant.linkedinUrl ? `<a href="${applicant.linkedinUrl}">${applicant.linkedinUrl}</a>` : 'N/A'}</li>
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
      passoutYear:
        user.role === "alumni" && user.alumni
          ? user.alumni.graduationYear
          : user.student
            ? user.student.graduationYear
            : null,
      linkedInProfile: user.linkedinUrl,
      currentJobTitle:
        user.role === "alumni" && user.alumni
          ? user.alumni.currentJobTitle
          : "Fresher",
      totalExperience:
        user.role === "alumni" && user.alumni
          ? user.alumni.totalExperience
          : null,
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

const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const jobId = parseInt(req.params.id);

  if (
    !status ||
    !["pending", "approved", "rejected", "expired"].includes(
      status.toLowerCase()
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid status provided. Must be one of: pending, approved, rejected, expired",
    });
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

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error in updateJobStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: error.message,
    });
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

export const pendingJobsForAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admin can view pending jobs.",
      error: "Insufficient permissions",
    });
  }

  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            photoUrl: true,
            alumni: {
              select: {
                companyName: true,
                currentJobTitle: true,
              }
            }
          }
        },
        jobRegistrations: {
          select: {
            id: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                photoUrl: true,
                department: true,
                alumni: {
                  select: {
                    currentJobTitle: true,
                    company_role: true,
                    companyName: true,
                    graduationYear: true,
                  },
                },
              },
            },
            job: {
              select: {
                id: true,
                userId: true,
                companyName: true,
                jobTitle: true,
                description: true,
                registrationType: true,
                registrationLink: true,
                getEmailNotification: true,
                deadline: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching pending jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending jobs.",
      error: error.message,
    });
  }
};

export const getAllJobsForAlumni = async (req, res) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only alumni can view their jobs.",
      error: "Insufficient permissions",
    });
  }

  try {
    const jobs = await prisma.job.findMany({
      where: {
        userId: req.user.id,
        status: {
          in: ["approved", "pending"],
        },
      },
      select: {
        id: true,
        userId: true,
        companyName: true,
        jobTitle: true,
        description: true,
        registrationType: true,
        registrationLink: true,
        getEmailNotification: true,
        deadline: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs for alumni:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs for alumni.",
      error: error.message,
    });
  }
};

export const getAllJobsForAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admin can view all jobs.",
      error: "Insufficient permissions",
    });
  }

  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: {
          in: ["approved", "pending", "rejected"],
        },
      },
      select: {
        id: true,
        userId: true,
        companyName: true,
        jobTitle: true,
        description: true,
        registrationType: true,
        registrationLink: true,
        getEmailNotification: true,
        deadline: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs for admin.",
      error: error.message,
    });
  }
};

//for admin and alumni
//get all registered students
//pending work todo for user verification
export const getJobRegistrations = async (req, res) => {
  if (!["admin", "alumni"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only admin and alumni can view job registrations.",
    });
  }

  const { jobId } = req.body; // Or req.query.jobId if you're using GET

  if (!jobId) {
    return res.status(400).json({
      success: false,
      message: "Job ID is required.",
    });
  }

  try {
    const registrations = await prisma.jobRegistration.findMany({
      where: { jobId: Number(jobId) },
      select: {
        id: true,
        jobId: true,
        userId: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching job registrations:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching job registrations.",
      error: error.message,
    });
  }
};
export const SelfAppliedJobs = async (req, res) => {
  if (req.user.role !== "alumni" && req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. Only alumni and students can view their applied jobs.",
      error: "Insufficient permissions",
    });
  }

  try {
    let jobs = [];
    if (req.user.role === "alumni") {
      // Alumni: jobs created by the user
      jobs = await prisma.job.findMany({
        where: {
          userId: req.user.id,
        },
        select: {
          id: true,
          userId: true,
          companyName: true,
          jobTitle: true,
          description: true,
          registrationType: true,
          registrationLink: true,
          getEmailNotification: true,
          deadline: true,
          status: true,
          createdAt: true,
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
    } 
      
      
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applied jobs.",
      error: error.message,
    });
  }
};

// @desc    Get all jobs the current user has applied for
// @route   GET /api/job/applied
// @access  Private (Authenticated User)
export const getJobsUserAppliedFor = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all job registrations for this user
    const registrations = await prisma.jobRegistration.findMany({
      where: { userId },
      select: { jobId: true },
    });
    const jobIds = registrations.map(r => r.jobId);
    if (jobIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    // Fetch job details for these jobIds
    const jobs = await prisma.job.findMany({
      where: { id: { in: jobIds } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('Error fetching jobs user applied for:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching applied jobs.', error: error.message });
  }
};

// @desc    Get all applicants for a job (full profile info)
// @route   GET /api/job/:jobId/applications
// @access  Private (admin, alumni)
export const getJobApplications = async (req, res) => {
  if (!['admin', 'alumni'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only admin and alumni can view job applications.',
    });
  }
  const jobId = parseInt(req.params.jobId);
  if (!jobId) {
    return res.status(400).json({ success: false, message: 'Job ID is required.' });
  }
  try {
    // Find all registrations for this job
    const registrations = await prisma.jobRegistration.findMany({
      where: { jobId },
      select: { userId: true, createdAt: true },
    });
    const userIds = registrations.map(r => r.userId);
    if (userIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    // Fetch user profiles (alumni or student)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        linkedinUrl: true,
        highestQualification: true,
        photoUrl: true,
        role: true,
        alumni: {
          select: {
            currentJobTitle: true,
            graduationYear: true,
            companyName: true,
            company_role: true,
            course: true,
            id: true,
            userId: true,
          },
        },
        student: {
          select: {
            graduationYear: true,
          },
        },
      },
    });
    // Format for frontend modal
    const applicants = users.map(u => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phoneNumber,
      highestQualification: u.highestQualification,
      passoutYear: u.alumni?.graduationYear || u.student?.graduationYear || null,
      currentJobTitle: u.alumni?.currentJobTitle || '',
      companyName: u.alumni?.companyName || '',
      companyRole: u.alumni?.company_role || '',
      course: u.alumni?.course || '',
      linkedInProfile: u.linkedinUrl,
      cvUrl: u.resumeUrl || '', // Use resumeUrl from User model
      photoUrl: u.photoUrl,
      role: u.role,
    }));
    return res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching job applications.', error: error.message });
  }
};
