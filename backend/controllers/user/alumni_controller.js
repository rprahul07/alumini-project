import { ROLES } from "../../constants/user_constants.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../services/user_service.js";
import multer from "multer";
import { handlePhotoUpload } from "../../utils/handlePhotoUpload.utils.js";

export const createAlumni = async (userData) => {
  const {
    graduationYear,
    course,
    currentJobTitle,
    companyName,
    fullName,
    email,
    password,
    phoneNumber,
    department,
  } = userData;

  const hashedPassword = await hashPassword(password);
  // Create user and alumni records in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the main user record
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        department,
        role: ROLES.ALUMNI,
      },
    });

    // Create the alumni-specific record
    const newAlumni = await tx.alumni.create({
      data: {
        graduationYear: parseInt(graduationYear),
        course,
        currentJobTitle,
        companyName,
        userId: newUser.id,
      },
    });

    return {
      user: newUser,
      alumni: newAlumni,
    };
  });

  return result;
};

export const registerAlumni = async (req, res) => {
  try {
    const { user, alumni } = await createAlumni(req.body);

    // Generate token using the user ID
    generateTokenAndSetCookie(user.id, ROLES.ALUMNI, res);

    res.status(201).json(
      createResponse(true, "Alumni registered successfully", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        alumniDetails: {
          graduationYear: alumni.graduationYear,
          course: alumni.course,
          currentJobTitle: alumni.currentJobTitle,
          companyName: alumni.companyName,
        },
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

export const getAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // ✅ Declare the user before using it
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        department: true,
        role: true,
        photoUrl: true,
        alumni: {
          select: {
            id: true,
            graduationYear: true,
            course: true,
            currentJobTitle: true,
            companyName: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching alumni by ID:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAllAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {
      role: ROLES.ALUMNI,
      ...(department && { department }),
    };

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereClause,
    });

    // Get alumni data
    const alumni = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        photoUrl: true,
        alumni: {
          select: {
            id: true,
            graduationYear: true,
            currentJobTitle: true,
            companyName: true,
            company_role: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    // Add userId property
    const alumniWithUserId = alumni.map((a) => ({ ...a, userId: a.id }));

    const response = {
      alumni: alumniWithUserId,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: skip + parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1,
      },
    };

    res
      .status(200)
      .json(createResponse(true, "Alumni retrieved successfully", response));
  } catch (error) {
    console.error("Error fetching all alumni:", error);
    handleError(error, req, res);
  }
};

export const deleteAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists and is an alumni
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        alumni: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    if (user.role !== "alumni") {
      return res.status(400).json({
        success: false,
        message: "User is not an alumni",
      });
    }

    // Delete alumni record first, then user record using transaction
    await prisma.$transaction([
      prisma.alumni.delete({
        where: { userId: userIdInt },
      }),
      prisma.user.delete({
        where: { id: userIdInt },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Alumni deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alumni by ID:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateAlumniById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists and is an alumni
    const user = await prisma.user.findUnique({
      where: { id: userIdInt },
      include: {
        alumni: {
          include: {
            workExperience: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found for this user",
      });
    }

    if (user.role !== "alumni") {
      return res.status(400).json({
        success: false,
        message: "User is not an alumni",
      });
    }

    // Handle photo upload using utility function
    const newPhotoUrl = await handlePhotoUpload(req, user.photoUrl);

    // Prepare update data for User table
    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (linkedinUrl !== undefined) userUpdateData.linkedinUrl = linkedinUrl;
    if (newPhotoUrl) userUpdateData.photoUrl = newPhotoUrl;
    if (twitterUrl !== undefined) userUpdateData.twitterUrl = twitterUrl;
    if (githubUrl !== undefined) userUpdateData.githubUrl = githubUrl;
    if (company_role !== undefined) userUpdateData.company_role = company_role;

    // Prepare update data for Alumni table
    const alumniUpdateData = {};
    if (graduationYear !== undefined) {
      const graduationYearInt = parseInt(graduationYear);
      if (isNaN(graduationYearInt)) {
        return res.status(400).json({
          success: false,
          message: "Invalid graduation year format",
        });
      }
      alumniUpdateData.graduationYear = graduationYearInt;
    }
    if (course !== undefined) alumniUpdateData.course = course;
    if (currentJobTitle !== undefined)
      alumniUpdateData.currentJobTitle = currentJobTitle;
    if (companyName !== undefined) alumniUpdateData.companyName = companyName;

    // Update both User and Alumni records using transaction
    const updatedData = await prisma.$transaction(async (prisma) => {
      // Update User record if there's data to update
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userIdInt },
          data: userUpdateData,
        });
      }

      // Update Alumni record if there's data to update
      if (Object.keys(alumniUpdateData).length > 0) {
        await prisma.alumni.update({
          where: { userId: userIdInt },
          data: alumniUpdateData,
        });
      }

      // Handle work experience updates
      if (workExperience !== undefined && Array.isArray(workExperience)) {
        if (workExperience.length > 0) {
          const workExperienceData = workExperience.map((exp) => ({
            companyName: exp.companyName,
            role: exp.role,
            alumniId: user.alumni.id,
          }));

          await prisma.alumniWorkExperience.createMany({
            data: workExperienceData,
          });
        }
      }

      // Fetch the complete updated record
      const finalResult = await prisma.user.findUnique({
        where: { id: userIdInt },
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          department: true,
          role: true,
          photoUrl: true,
          bio: true,
          linkedinUrl: true,
          twitterUrl: true,
          githubUrl: true,
          highestQualification: true,
          totalExperience: true,
          skills: true,
          resumeUrl: true,
          alumni: {
            select: {
              id: true,
              graduationYear: true,
              course: true,
              currentJobTitle: true,
              companyName: true,
              workExperience: {
                select: {
                  id: true,
                  companyName: true,
                  role: true,
                },
                orderBy: {
                  id: "asc",
                },
              },
            },
          },
        },
      });

      return finalResult;
    });

    return res.status(200).json({
      success: true,
      message: "Alumni updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating alumni by ID:", error);

    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB",
        });
      }
      return res.status(400).json({
        success: false,
        message: "File upload error",
      });
    }

    // Handle file type error
    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (JPEG, PNG, GIF, WebP)",
      });
    }

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// for updating the logged-in alumni's profile
export const updateAlumniSelf = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      email,
      phoneNumber,
      department,
      bio,
      skills,
      resumeUrl,
      linkedinUrl,
      twitterUrl,
      githubUrl,
      highestQualification,
      totalExperience,
      graduationYear,
      course,
      currentJobTitle,
      companyName,
      company_role,
      workExperience,
    } = req.body;

    // Handle skills from FormData (multiple fields with same name)
    let skillsArray = skills;
    if (skills && !Array.isArray(skills)) {
      // If skills is not an array, it might be a single value from FormData
      skillsArray = [skills];
    }
    
    // Validate skills array
    if (skillsArray && !Array.isArray(skillsArray)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array",
      });
    }
    

    // Validate resumeUrl if provided
    if (resumeUrl && typeof resumeUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Resume URL must be a string",
      });
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        alumni: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found",
      });
    }

    if (user.role !== "alumni") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only alumni can update their profile.",
      });
    }

    const newPhotoUrl = await handlePhotoUpload(req, user.photoUrl);

    const userUpdateData = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (email !== undefined) userUpdateData.email = email;
    if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
    if (department !== undefined) userUpdateData.department = department;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (linkedinUrl !== undefined) userUpdateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) userUpdateData.twitterUrl = twitterUrl;
    if (githubUrl !== undefined) userUpdateData.githubUrl = githubUrl;
    if (newPhotoUrl) userUpdateData.photoUrl = newPhotoUrl;
    if (resumeUrl !== undefined) userUpdateData.resumeUrl = resumeUrl;
    if (skillsArray !== undefined) userUpdateData.skills = skillsArray;
    if (highestQualification !== undefined) userUpdateData.highestQualification = highestQualification;
    if (totalExperience !== undefined) userUpdateData.totalExperience = parseInt(totalExperience) || 0;

    if (workExperience !== undefined) {
      if (!Array.isArray(workExperience)) {
        return res.status(400).json({
          success: false,
          message: "workExperience must be an array",
        });
      }
      userUpdateData.workExperience = workExperience;
    }

    const alumniUpdateData = {};
    if (graduationYear !== undefined) {
      const gradYear = parseInt(graduationYear);
      if (isNaN(gradYear)) {
        return res.status(400).json({
          success: false,
          message: "Invalid graduation year format",
        });
      }
      alumniUpdateData.graduationYear = gradYear;
    }
    if (course !== undefined) alumniUpdateData.course = course;
    if (currentJobTitle !== undefined)
      alumniUpdateData.currentJobTitle = currentJobTitle;
    if (companyName !== undefined) alumniUpdateData.companyName = companyName;
    if (company_role !== undefined)
      alumniUpdateData.company_role = company_role;

    const updatedUser = await prisma.$transaction(async (prisma) => {
      if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      if (Object.keys(alumniUpdateData).length > 0) {
        await prisma.alumni.update({
          where: { userId },
          data: alumniUpdateData,
        });
      }

      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          department: true,
          role: true,
          photoUrl: true,
          bio: true,
          linkedinUrl: true,
          twitterUrl: true,
          githubUrl: true,
          workExperience: true,
          skills: true,
          resumeUrl: true,
          highestQualification: true,
          totalExperience: true,
          alumni: {
            select: {
              id: true,
              graduationYear: true,
              course: true,
              currentJobTitle: true,
              companyName: true,
              company_role: true,
            },
          },
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating alumni profile:", error);

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "File upload error: " + error.message,
      });
    }

    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed (JPEG, PNG, etc.)",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to get the logged-in alumni's profile

export const getAlumniSelf = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        photoUrl: true,
        bio: true,
        linkedinUrl: true,
        twitterUrl: true,
        githubUrl: true,
        workExperience: true,
        skills: true,
        resumeUrl: true,
        highestQualification: true,
        totalExperience: true,
        role: true,
        alumni: {
          select: {
            id: true,
            graduationYear: true,
            course: true,
            currentJobTitle: true,
            companyName: true,
            company_role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alumni profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching alumni profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user to check if they have a profile picture
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        photoUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.photoUrl) {
      return res.status(400).json({
        success: false,
        message: "No profile picture to delete",
      });
    }

    // Update user record to remove photoUrl
    await prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null },
    });

    return res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAlumniByTier = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const userId = req.user.id;

    if (!alumniId) {
      return res.status(400).json({
        success: false,
        message: "Alumni ID is required",
      });
    }

    const alumniIdInt = parseInt(alumniId);
    if (isNaN(alumniIdInt)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    const alumni = await prisma.user.findUnique({
      where: { id: alumniIdInt },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        linkedinUrl: true,
        role: true,
        alumni: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }
    if (!alumni.alumni || alumni.role !== "alumni") {
      return res.status(404).json({
        success: false,
        message: "User is not an alumni",
      });
    }

    // Check for support request between the user and alumni
    const supportRequest = await prisma.supportRequest.findFirst({
      where: {
        support_requester: userId,
        alumniId: alumniIdInt,
      },
      select: {
        id: true,
        status: true,
        descriptionbyAlumni: true,
        tier: true,
        createdAt: true,
      },
    });

    if (!supportRequest) {
      return res.status(403).json({
        success: false,
        message: "No support request found between you and this alumni",
      });
    }

    // Initialize contact info as null
    let contactInfo = {
      email: null,
      phoneNumber: null,
      linkedinUrl: null,
      status: null,
      descriptionbyAlumni: null,
    };

    // Check status and tier to determine what information to return
    if (supportRequest.status === "pending") {
      contactInfo = {
        email: null,
        phoneNumber: null,
        linkedinUrl: null,
        status: null,
        descriptionbyAlumni: null,
      };
    } else if (supportRequest.status === "accepted") {
      switch (supportRequest.tier) {
        case 1:
          contactInfo = {
            email: alumni.email,
            phoneNumber: null,
            linkedinUrl: null,
            status: supportRequest.status,
            descriptionbyAlumni: supportRequest.descriptionbyAlumni,
          };
          break;
        case 2:
          contactInfo = {
            email: alumni.email,
            phoneNumber: null,
            linkedinUrl: alumni.linkedinUrl,
            status: supportRequest.status,
            descriptionbyAlumni: supportRequest.descriptionbyAlumni,
          };
          break;
        case 3:
          contactInfo = {
            email: alumni.email,
            phoneNumber: alumni.phoneNumber,
            linkedinUrl: alumni.linkedinUrl,
            status: supportRequest.status,
            descriptionbyAlumni: supportRequest.descriptionbyAlumni,
          };
          break;
        default:
          contactInfo = {
            email: null,
            phoneNumber: null,
            linkedinUrl: null,
            status: supportRequest.status,
            descriptionbyAlumni: null,
          };
      }
    } else {
      // If status is rejected or any other status
      contactInfo = {
        email: null,
        phoneNumber: null,
        linkedinUrl: null,
        status: supportRequest.status,
        descriptionbyAlumni: null,
      };
    }

    const responseData = {
      email: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber,
      linkedinUrl: contactInfo.linkedinUrl,
      status: contactInfo.status,
      descriptionbyAlumni: contactInfo.descriptionbyAlumni,
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching alumni by ID:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
