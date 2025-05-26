import bcrypt from "bcryptjs";
import {
  findUserByEmailAndRole,
  checkIfEmailExists,
} from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateTocken.js";
import pool from "../db/db.js";

// import { OAuth2Client } from "google-auth-library";
const isPasswordStrong = (password) => {
  const minLength = 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const noConsecutiveChars = !/(.)\1{2,}/.test(password);
  const noSequentialChars = !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
  
  const commonPatterns = [
    'password', '123456', 'qwerty', 'admin',
    'welcome', 'letmein', 'monkey', 'dragon'
  ];
  const noCommonPatterns = !commonPatterns.some(pattern => password.toLowerCase().includes(pattern));

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    noConsecutiveChars &&
    noSequentialChars &&
    noCommonPatterns
  );
};
export const signup = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      graduationYear,
      department,
      course,
      currentJobTitle,
      companyName,
      designation,
      currentSemester,
      rollNumber,
      role,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        error: "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character. It cannot contain 3 or more consecutive identical characters, sequential characters, or common patterns."
      });
    }

    // Check if email exists
    try {
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      if (error.code === '42P01') {
        // Table doesn't exist error
        return res.status(500).json({ error: "Database setup incomplete. Please try again later." });
      }
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    try {
      if (role === "student") {
        // Validate student-specific fields
        if (!department || !currentSemester || !rollNumber) {
          return res.status(400).json({ error: "Please fill in all required student fields" });
        }

        const result = await pool.query(
          `INSERT INTO students (full_name, email, phone_number, password, department, current_semester, roll_number)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            fullName,
            email,
            phoneNumber,
            hashedPassword,
            department,
            currentSemester,
            rollNumber,
          ]
        );
        newUser = result.rows[0];
      } else if (role === "alumni") {
        // Validate alumni-specific fields
        if (!department || !graduationYear || !currentJobTitle || !companyName) {
          return res.status(400).json({ error: "Please fill in all required alumni fields" });
        }

        const result = await pool.query(
          `INSERT INTO alumni (full_name, email, phone_number, password, graduation_year, department, current_job_title, company_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            fullName,
            email,
            phoneNumber,
            hashedPassword,
            graduationYear,
            department,
            currentJobTitle,
            companyName,
          ]
        );
        newUser = result.rows[0];
      } else if (role === "faculty") {
        // Validate faculty-specific fields
        if (!department || !designation) {
          return res.status(400).json({ error: "Please fill in all required faculty fields" });
        }

        const result = await pool.query(
          `INSERT INTO faculty (full_name, email, phone_number, password, designation, department)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [
            fullName,
            email,
            phoneNumber,
            hashedPassword,
            designation,
            department,
          ]
        );
        newUser = result.rows[0];
      } else {
        return res.status(400).json({ error: "Invalid role specified" });
      }
    } catch (error) {
      console.error("Error inserting user:", error);
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.constraint.includes('email')) {
          return res.status(409).json({ error: "Email already exists" });
        }
        if (error.constraint.includes('roll_number')) {
          return res.status(409).json({ error: "Roll number already exists" });
        }
      }
      throw error;
    }

    try {
      generateTokenAndSetCookie(newUser.id, role, res);
    } catch (error) {
      console.error("Error generating token:", error);
      if (error.message.includes('secretOrPrivateKey must have a value')) {
        return res.status(500).json({ error: "Server configuration error. Please contact administrator." });
      }
      throw error;
    }

    res.status(201).json({
      _id: newUser.id,
      fullName: newUser.full_name,
      email: newUser.email,
      role,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};

//  NOT YET INSTALLED google-auth-library

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleSignup = async (req, res) => {
//   try {
//     const { token, role } = req.body;

//     // 1. Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     // 2. Check if email exists in DB
//     const emailExists = await checkIfEmailExists(email);
//     if (emailExists) {
//       return res
//         .status(400)
//         .json({ error: "Email already exists. Please log in." });
//     }

//     // Optional: Get additional info from frontend (phone, department etc.)
//     const {
//       phoneNumber,
//       graduationYear,
//       department,
//       course,
//       currentJobTitle,
//       companyName,
//       designation,
//       currentSemester,
//       rollNumber,
//     } = req.body;

//     let newUser;
//     if (role === "student") {
//       const result = await pool.query(
//         `INSERT INTO students (full_name, email, phone_number, course, department, current_semester, roll_number)
//          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//         [
//           name,
//           email,
//           phoneNumber || null,
//           course || null,
//           department || null,
//           currentSemester || null,
//           rollNumber || null,
//         ]
//       );
//       newUser = result.rows[0];
//     } else if (role === "alumni") {
//       const result = await pool.query(
//         `INSERT INTO alumni (full_name, email, phone_number, graduation_year, department, course, current_job_title, company_name)
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
//         [
//           name,
//           email,
//           phoneNumber || null,
//           graduationYear || null,
//           department || null,
//           course || null,
//           currentJobTitle || null,
//           companyName || null,
//         ]
//       );
//       newUser = result.rows[0];
//     } else if (role === "faculty") {
//       const result = await pool.query(
//         `INSERT INTO faculty (full_name, email, phone_number, designation, department)
//          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//         [
//           name,
//           email,
//           phoneNumber || null,
//           designation || null,
//           department || null,
//         ]
//       );
//       newUser = result.rows[0];
//     } else {
//       return res.status(400).json({ error: "Invalid role specified" });
//     }

//     // 3. Issue JWT
//     generateTokenAndSetCookie(newUser.id, res);

//     res.status(201).json({
//       _id: newUser.id,
//       fullName: newUser.full_name,
//       email: newUser.email,
//       role,
//     });
//   } catch (error) {
//     console.error("Error in Google Signup:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await findUserByEmailAndRole(email, role);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user.id, role, res);

    res.status(200).json({
      _id: user.id,
      fullName: user.full_name,
      email: user.email,
      role,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // If the middleware has passed, the user is authenticated
    // The user ID will be available in req.user.id (set by the auth middleware)
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user details from database based on role stored in token
    let userQuery;
    if (req.user.role === 'student') {
      userQuery = 'SELECT id, full_name, email, role FROM students WHERE id = $1';
    } else if (req.user.role === 'alumni') {
      userQuery = 'SELECT id, full_name, email, role FROM alumni WHERE id = $1';
    } else if (req.user.role === 'faculty') {
      userQuery = 'SELECT id, full_name, email, role FROM faculty WHERE id = $1';
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const result = await pool.query(userQuery, [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      _id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
