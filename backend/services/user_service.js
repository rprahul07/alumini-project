import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { PASSWORD_REQUIREMENTS, ROLES } from "../constants/user_constants.js";
import { AppError } from "../utils/response.utils.js";

export const validatePassword = (password) => {
  const {
    minLength,
    maxLength,
    patterns: { uppercase, lowercase, special },
    commonPasswords,
  } = PASSWORD_REQUIREMENTS;

  const hasCommonPattern = commonPasswords.some((pattern) =>
    password.toLowerCase().includes(pattern)
  );

  const isValid =
    password.length >= minLength &&
    password.length <= maxLength &&
    uppercase.test(password) &&
    lowercase.test(password) &&
    special.test(password) &&
    !hasCommonPattern;

  if (!isValid) {
    throw new AppError(
      "Password must be 8 to 12 characters long and include at least one uppercase letter, one lowercase letter, and one special character. Common passwords are not allowed.",
      400
    );
  }
};

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully:", {
      originalLength: password.length,
      hashedLength: hashedPassword.length,
    });
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new AppError("Error processing password", 500);
  }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) {
      console.error("Missing password or hash:", {
        hasPlainPassword: Boolean(plainPassword),
        hasHashedPassword: Boolean(hashedPassword),
      });
      return false;
    }

    console.log("Verifying password:", {
      plainPasswordLength: plainPassword.length,
      hashedPasswordLength: hashedPassword.length,
    });

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password verification result:", isValid);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
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

  // Debug logging
  console.log("findUserByRole query:", {
    where,
    select: { ...select, ...include },
  });

  const user = await prisma.user.findUnique({
    where,
    select: {
      ...select,
      // Always include the role-specific relation if not already in select
      ...(Object.keys(include).length > 0 && !select[Object.keys(include)[0]]
        ? include
        : {}),
    },
  });

  console.log(
    "findUserByRole result:",
    user
      ? {
          ...user,
          password: user.password
            ? `[Hash length: ${user.password.length}]`
            : undefined,
        }
      : null
  );

  return user;
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
