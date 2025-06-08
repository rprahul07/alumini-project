import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { PASSWORD_REQUIREMENTS, ROLES } from "../constants/user_constants.js";
import { AppError } from "../utils/response.utils.js";

export const validatePassword = (password) => {
  const {
    minLength,
    patterns: {
      uppercase,
      lowercase,
      number,
      special,
      consecutive,
      sequential,
    },
    commonPasswords,
  } = PASSWORD_REQUIREMENTS;

  const hasCommonPattern = commonPasswords.some((pattern) =>
    password.toLowerCase().includes(pattern)
  );

  const isValid =
    password.length >= minLength &&
    uppercase.test(password) &&
    lowercase.test(password) &&
    number.test(password) &&
    special.test(password) &&
    !consecutive.test(password) &&
    !sequential.test(password) &&
    !hasCommonPattern;

  if (!isValid) {
    throw new AppError(
      "Password must be at least 12 characters long and include uppercase, lowercase, number, and special character. " +
        "It cannot contain 3+ consecutive identical characters, sequential characters, or common patterns.",
      400
    );
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const checkEmailExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return Boolean(user);
};

export const findUserByRole = async (
  identifier,
  role,
  select = { id: true }
) => {
  const where = {
    ...(typeof identifier === "string" && identifier.includes("@")
      ? { email: identifier }
      : { id: identifier }),
    role: role.toLowerCase(),
  };

  // Include role-specific data based on the role
  const include = {};
  switch (role.toLowerCase()) {
    case "student":
      include.student = true;
      break;
    case "alumni":
      include.alumni = true;
      break;
    case "faculty":
      include.faculty = true;
      break;
    case "admin":
      include.admin = true;
      break;
  }

  return prisma.user.findUnique({
    where,
    select: {
      ...select,
      // Always include the role-specific relation if not already in select
      ...(Object.keys(include).length > 0 && !select[Object.keys(include)[0]]
        ? include
        : {}),
    },
  });
};

export const createUser = async (userData, role) => {
  try {
    const { password, confirmPassword, role: userRole, ...rest } = userData;
    const hashedPassword = await hashPassword(password);

    console.log("Creating user with data:", {
      ...rest,
      role,
      hashedPasswordLength: hashedPassword.length,
    });

    const newUser = await prisma[role.toLowerCase()].create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", {
      id: newUser.id,
      email: newUser.email,
      role,
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", {
      error: error.message,
      code: error.code,
      meta: error.meta,
    });

    if (error.code === "P2002") {
      throw new AppError(
        `${error.meta?.target?.[0] || "Field"} already exists`,
        409
      );
    }

    throw error;
  }
};

const validateStudentFields = (data) => {
  const { department, currentSemester, rollNumber } = data;
  if (!department || !currentSemester || !rollNumber) {
    throw new AppError("Missing required student fields", 400);
  }
};

const validateAlumniFields = (data) => {
  const { department, graduationYear, currentJobTitle, companyName } = data;
  if (!department || !graduationYear || !currentJobTitle || !companyName) {
    throw new AppError("Missing required alumni fields", 400);
  }
};

const validateFacultyFields = (data) => {
  const { department, designation } = data;
  if (!department || !designation) {
    throw new AppError("Missing required faculty fields", 400);
  }
};

export const validateUserData = (data, role) => {
  const { fullName, email, phoneNumber, password } = data;
  if (!fullName || !email || !phoneNumber || !password) {
    throw new AppError("Please fill in all required fields", 400);
  }

  switch (role) {
    case ROLES.STUDENT:
      validateStudentFields(data);
      break;
    case ROLES.ALUMNI:
      validateAlumniFields(data);
      break;
    case ROLES.FACULTY:
      validateFacultyFields(data);
      break;
    default:
      throw new AppError("Invalid role specified", 400);
  }
};
