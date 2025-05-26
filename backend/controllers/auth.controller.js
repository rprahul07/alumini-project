import bcrypt from "bcryptjs";
import {
  findUserByEmailAndRole,
  checkIfEmailExists,
} from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateTocken.js";
import pool from "../db/db.js";

// import { OAuth2Client } from "google-auth-library";
const isPasswordStrong = (password) => {
  const minLength = 8;
  return (
    password.length >= minLength &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};
export const signup = async (req, res) => {
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

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (role === "student") {
      const result = await pool.query(
        `INSERT INTO students (full_name, email, phone_number, password, course, department, current_semester, roll_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          fullName,
          email,
          phoneNumber,
          hashedPassword,
          course,
          department,
          currentSemester,
          rollNumber,
        ]
      );
      newUser = result.rows[0];
    } else if (role === "alumni") {
      const result = await pool.query(
        `INSERT INTO alumni (full_name, email, phone_number, password, graduation_year, department, course, current_job_title, company_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          fullName,
          email,
          phoneNumber,
          hashedPassword,
          graduationYear,
          department,
          course,
          currentJobTitle,
          companyName,
        ]
      );
      newUser = result.rows[0];
    } else if (role === "faculty") {
      const result = await pool.query(
        `INSERT INTO faculty (full_name, email, phone_number, password, designation, department)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [fullName, email, phoneNumber, hashedPassword, designation, department]
      );
      newUser = result.rows[0];
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    generateTokenAndSetCookie(newUser.id, res);

    res.status(201).json({
      _id: newUser.id,
      fullName: newUser.full_name,
      email: newUser.email,
      role,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ error: "Internal server error" });
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

    generateTokenAndSetCookie(user.id, res);

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
