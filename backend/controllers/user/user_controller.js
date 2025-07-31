import { AppError } from "../../utils/response.utils.js";
import { ROLES } from "../../constants/user_constants.js";
import generateTokenAndSetCookie from "../../utils/generateTocken.js";
import { createResponse, handleError } from "../../utils/response.utils.js";
import {
  validatePassword,
  validateUserData,
  checkEmailExists,
  findUserByRole,
  verifyPassword,
} from "../../services/user_service.js";
import { createStudent } from "./student_controller.js";
import { createAlumni } from "./alumni_controller.js";
import { createFaculty } from "./faculty_controller.js";
import prisma from "../../lib/prisma.js";

export const searchStudentsController = async (req, res) => {
  try {
    const {
      department,
      currentSemester,
      search,
      limit = 10,
      offset = 0,
    } = req.query;

    console.log(
      "Filtering students by department:",
      department,
      "Current semester:",
      currentSemester,
      "Search term:",
      search
    );

    // Validate limit and offset
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;

    if (limitInt < 1 || limitInt > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100.",
        error: "Invalid limit",
      });
    }

    if (offsetInt < 0) {
      return res.status(400).json({
        success: false,
        message: "Offset must be a non-negative number.",
        error: "Invalid offset",
      });
    }

    // Build where clause for filtering
    let whereClause = {};
    const conditions = [];

    // Filter by department (from User table)
    if (department && department.trim()) {
      conditions.push({
        user: {
          department: {
            contains: department.trim(),
            mode: "insensitive",
          },
        },
      });
    }

    // Filter by current semester (from Student table)
    if (currentSemester && currentSemester.trim()) {
      const semesterInt = parseInt(currentSemester);
      if (isNaN(semesterInt) || semesterInt < 1 || semesterInt > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester. Must be between 1 and 12.",
          error: "Invalid semester",
        });
      }

      conditions.push({
        currentSemester: semesterInt,
      });
    }

    // Filter by name or skills search (from User table)
    if (search && search.trim()) {
      conditions.push({
        OR: [
          {
            user: {
              fullName: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              skills: {
                has: search.trim().toLowerCase(), // Search in skills array
              },
            },
          },
        ],
      });
    }

    // Combine conditions
    if (conditions.length > 0) {
      whereClause = {
        AND: conditions,
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.student.count({
      where: whereClause,
    });

    // Get student profiles
    const studentProfiles = await prisma.student.findMany({
      where: whereClause,
      select: {
        rollNumber: true,
        currentSemester: true,
        graduationYear: true,
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            skills: true, // Include skills for search
          },
        },
      },
      orderBy: [
        {
          currentSemester: "asc", // Sort by semester first
        },
        {
          user: {
            fullName: "asc", // Then alphabetically by name
          },
        },
      ],
      take: limitInt,
      skip: offsetInt,
    });

    // Transform the data to flatten the structure
    const transformedProfiles = studentProfiles.map((student) => ({
      id: student.user.id, // Use only 'id' for user ID
      name: student.user.fullName,
      photoUrl: student.user.photoUrl,
      department: student.user.department,
      rollNumber: student.rollNumber,
      currentSemester: student.currentSemester,
      graduationYear: student.graduationYear,
      skills: student.user.skills || [], // Include skills in response
    }));

    console.log(
      `Found ${transformedProfiles.length} student profiles out of ${totalCount} total`
    );

    // Build dynamic success message
    let message = "Student profiles retrieved successfully";
    const filters = [];

    if (department) {
      filters.push(`department: ${department}`);
    }

    if (currentSemester) {
      filters.push(`semester: ${currentSemester}`);
    }

    if (search) {
      filters.push(`name or skills containing "${search.trim()}"`);
    }

    if (filters.length > 0) {
      message += ` for ${filters.join(" and ")}`;
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: message,
      data: {
        profiles: transformedProfiles,
        filter: {
          department: department || null,
          currentSemester: currentSemester ? parseInt(currentSemester) : null,
          search: search ? search.trim() : null,
        },
        pagination: {
          total: totalCount,
          limit: limitInt,
          offset: offsetInt,
          hasMore: offsetInt + limitInt < totalCount,
          currentPage: Math.floor(offsetInt / limitInt) + 1,
          totalPages: Math.ceil(totalCount / limitInt),
        },
      },
    });
  } catch (error) {
    console.error("Error in searchStudentsController:", error);

    // Handle specific Prisma errors
    if (error.code === "P2001") {
      return res.status(404).json({
        success: false,
        message: "Student records not found",
        error: "No students found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const searchAlumniProfilesController = async (req, res) => {
  try {
    const {
      graduationYear,
      search,
      sortOrder = "desc",
      limit = 10,
      offset = 0,
    } = req.query;

    const userId = req.user.id;

    console.log(
      "Filtering alumni profiles by graduation year:",
      graduationYear,
      "Search term (name or company):",
      search,
      "Sort order:",
      sortOrder
    );

    // Validate limit and offset
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;

    if (limitInt < 1 || limitInt > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100.",
        error: "Invalid limit",
      });
    }

    if (offsetInt < 0) {
      return res.status(400).json({
        success: false,
        message: "Offset must be a non-negative number.",
        error: "Invalid offset",
      });
    }

    // Validate sort order
    if (!["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "Sort order must be 'asc' or 'desc'.",
        error: "Invalid sort order",
      });
    }

    // Build where clause for filters
    let whereClause = {};

    // Add graduation year filter
    if (graduationYear && graduationYear.trim()) {
      const yearInt = parseInt(graduationYear);
      if (
        isNaN(yearInt) ||
        yearInt < 1900 ||
        yearInt > new Date().getFullYear() + 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid graduation year provided. Must be between 1900 and current year + 10.",
          error: "Invalid graduation year",
        });
      }

      whereClause.graduationYear = yearInt;
    }

    // Add search filter for both name and company name
    if (search && search.trim()) {
      whereClause.OR = [
        {
          user: {
            fullName: {
              contains: search.trim(),
              mode: "insensitive", // Case-insensitive search
            },
          },
        },
        {
          companyName: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.alumni.count({
      where: whereClause,
    });

    // Build order by clause
    const orderBy = [
      {
        graduationYear: sortOrder,
      },
      {
        user: {
          fullName: "asc", // Secondary sort by name
        },
      },
    ];

    const alumniProfiles = await prisma.alumni.findMany({
      where: whereClause,
      select: {
        id: true,                // Alumni table primary key - ADDED
        graduationYear: true,
        currentJobTitle: true,
        companyName: true,
        company_role: true,
        course: true,
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            bio: true,
            department: true,
            supportRequestsReceived: {
              where: {
                support_requester: userId,
              },
              select: {
                status: true,
                tier: true,
              },
            },
          },
        },
      },
      orderBy: orderBy,
      take: limitInt,
      skip: offsetInt,
    });

    const transformedProfiles = alumniProfiles.map((alumni) => {
      // Get support request status (if exists)
      const supportRequest = alumni.user.supportRequestsReceived[0] || null;

      return {
        alumniId: alumni.id,        
        userId: alumni.user.id,
        name: alumni.user.fullName,
        photoUrl: alumni.user.photoUrl,
        bio: alumni.user.bio,
        department: alumni.user.department,
        company_role: alumni.company_role,
        graduationYear: alumni.graduationYear,
        currentJobTitle: alumni.currentJobTitle,
        companyName: alumni.companyName,
        course: alumni.course,
        connectionStatus: supportRequest ? supportRequest.status : null,
        tier: supportRequest ? supportRequest.tier : null,
      };
    });

    console.log(
      `Found ${transformedProfiles.length} alumni profiles out of ${totalCount} total`
    );

    // Build dynamic success message
    let message = "Alumni profiles retrieved successfully";
    const filters = [];

    if (graduationYear) {
      filters.push(`graduation year ${graduationYear}`);
    }

    if (search) {
      filters.push(`name or company containing "${search.trim()}"`);
    }

    if (filters.length > 0) {
      message += ` for ${filters.join(" and ")}`;
    }

    message += ` (sorted ${sortOrder}ending)`;

    return res.status(200).json({
      success: true,
      message: message,
      data: {
        profiles: transformedProfiles,
        filter: {
          graduationYear: graduationYear ? parseInt(graduationYear) : null,
          search: search ? search.trim() : null,
          sortOrder: sortOrder,
        },
        pagination: {
          total: totalCount,
          limit: limitInt,
          offset: offsetInt,
          hasMore: offsetInt + limitInt < totalCount,
          currentPage: Math.floor(offsetInt / limitInt) + 1,
          totalPages: Math.ceil(totalCount / limitInt),
        },
      },
    });
  } catch (error) {
    console.error("Error in searchAlumniProfilesController:", error);

    if (error.code === "P2001") {
      return res.status(404).json({
        success: false,
        message: "Alumni records not found",
        error: "No alumni found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    // console.log('Registration request received:', {
    //   body: { ...req.body, password: '[REDACTED]' }
    // });

    const { password, confirmPassword, role } = req.body;
    console.log("role" + req.body);
    if (!role) {
      throw new AppError("Role is required", 400);
    }

    if (!Object.values(ROLES).includes(role.toLowerCase())) {
      throw new AppError("Invalid role specified", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords don't match", 400);
    }

    console.log("Validating password...");
    validatePassword(password);

    console.log("Validating user data...");
    validateUserData(req.body, role);

    console.log("Checking if email exists...");
    if (await checkEmailExists(req.body.email)) {
      throw new AppError("Email already exists", 409);
    }

    console.log("Creating user...");
    let newUser;
    let additionalData = null;

    try {
      switch (role.toLowerCase()) {
        case ROLES.STUDENT:
          newUser = await createStudent(req.body);
          break;
        case ROLES.ALUMNI:
          const alumniResult = await createAlumni(req.body);
          newUser = alumniResult.user;
          additionalData = alumniResult.alumni;
          break;
        case ROLES.FACULTY:
          const facultyResult = await createFaculty(req.body);
          newUser = facultyResult.user;
          break;
        default:
          throw new AppError("Invalid role specified", 400);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    console.log("User created successfully:", {
      id: newUser.id,
      email: newUser.email,
      role,
    });

    generateTokenAndSetCookie(newUser.id, role, res);

    // Build response data
    const responseData = {
      _id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role,
    };

    // Add role-specific data if available
    if (role.toLowerCase() === ROLES.ALUMNI && additionalData) {
      responseData.alumniDetails = {
        graduationYear: additionalData.graduationYear,
        course: additionalData.course,
        currentJobTitle: additionalData.currentJobTitle,
        companyName: additionalData.companyName,
      };
    }

    res
      .status(201)
      .json(
        createResponse(true, `${role} registered successfully`, responseData)
      );
  } catch (error) {
    console.error("Registration error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    });
    handleError(error, req, res);
  }
};
// Login function for all roles
// This function checks the user's credentials and generates a JWT token if valid.
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new AppError("Please provide email, password and role", 400);
    }

    const user = await findUserByRole(email, role, {
      id: true,
      fullName: true,
      email: true,
      password: true,
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateTokenAndSetCookie(user.id, role, res);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    handleError(error, req, res);
  }
};

// Logout function to clear the JWT cookie
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json(createResponse(true, "Logged out successfully"));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Check authentication status and return user details
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const user = await findUserByRole(req.user.id, req.user.role, {
      id: true,
      fullName: true,
      email: true,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(
      createResponse(true, "User authenticated", {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: req.user.role,
      })
    );
  } catch (error) {
    handleError(error, req, res);
  }
};

// Get user profile based on role
// This function retrieves the user's profile information based on their role.
export const getUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    const user = await findUserByRole(id, role, {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      department: true,
      ...(role === "student" && {
        currentSemester: true,
        rollNumber: true,
      }),
      ...(role === "alumni" && {
        graduationYear: true,
        course: true,
        currentJobTitle: true,
        companyName: true,
      }),
      ...(role === "faculty" && {
        designation: true,
      }),
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(createResponse(true, "User profile retrieved successfully", user));
  } catch (error) {
    handleError(error, req, res);
  }
};

// Update user profile based on role
// This function allows users to update their profile information, excluding sensitive fields like password and email.
export const updateUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { password, email, role: newRole, ...updateData } = req.body;

    // Prevent updating sensitive fields
    if (password) {
      throw new AppError("Cannot update password through this endpoint", 400);
    }
    if (email) {
      throw new AppError("Cannot update email through this endpoint", 400);
    }
    if (newRole) {
      throw new AppError("Cannot update role", 400);
    }

    const updatedUser = await findUserByRole(id, role, {
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        department: true,
        ...(role === "student" && {
          currentSemester: true,
          rollNumber: true,
        }),
        ...(role === "alumni" && {
          graduationYear: true,
          course: true,
          currentJobTitle: true,
          companyName: true,
        }),
        ...(role === "faculty" && {
          designation: true,
        }),
      },
    });

    res.json(createResponse(true, "Profile updated successfully", updatedUser));
  } catch (error) {
    handleError(error, req, res);
  }
};
export const getAlumniByTier = async (req, res) => {
  const userId = req.user.id;

  try {
    const requests = await prisma.supportRequest.findMany({
      where: {
        support_requester: userId,
      },
      select: {
        id: true,
        status: true,
        tier: true,
        descriptionbyUser: true,
        descriptionbyAlumni: true,
        alumni: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
            department: true,
            phoneNumber: true,
            linkedinUrl: true,
            email: true,
            alumni: {
              select: {
                graduationYear: true,
                course: true,
                currentJobTitle: true,
                companyName: true,
                company_role: true,
              },
            },
          },
        },
      },
    });

    if (!requests || requests.length === 0) {
      return res.status(200).json({
        success: true,
        requests: [],
      });
    }

    const result = requests.map((request) => {
      const { alumni } = request;
      const user = alumni || {};

      const baseAlumniInfo = {
        id: user.id,
        fullName: user.fullName,
        photoUrl: user.photoUrl,
      };

      if (request.status !== "accepted") {
        return {
          requestId: request.id, // added
          status: request.status,
          message: "Pending alumni acceptance",
          tier: request.tier,
          alumni: baseAlumniInfo,
        };
      }

      const detailedInfo = {
        ...baseAlumniInfo,
        department: user.department,
        graduationYear: user.alumni?.graduationYear,
        course: user.alumni?.course,
        currentJobTitle: user.alumni?.currentJobTitle,
        companyName: user.alumni?.companyName,
        company_role: user.alumni?.company_role,
      };

      // Add tier-specific data
      if (request.tier === 3) {
        detailedInfo.phoneNumber = user.phoneNumber;
        detailedInfo.linkedinUrl = user.linkedinUrl;
        detailedInfo.email = user.email; // Assuming email is available in user object
      } else if (request.tier === 1) {
        detailedInfo.email = user.email; // Assuming email is available in user object
      } else if (request.tier === 2) {
        detailedInfo.linkedinUrl = user.linkedinUrl;
        detailedInfo.email = user.email; // Assuming email is available in user object
      }

      return {
        status: request.status,
        tier: request.tier,
        descriptionbyUser: request.descriptionbyUser,
        descriptionbyAlumni: request.descriptionbyAlumni,
        requestId: request.id,
        
        alumni: detailedInfo,
      };
    });

    return res.status(200).json({
      success: true,
      requests: result,
    });

  } catch (error) {
    console.error("Error fetching alumni data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};