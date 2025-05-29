import jwt from "jsonwebtoken";
import pool from "../db/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    let userQuery;
    if (decoded.role === 'student') {
      userQuery = 'SELECT id, full_name, email, role FROM students WHERE id = $1';
    } else if (decoded.role === 'alumni') {
      userQuery = 'SELECT id, full_name, email, role FROM alumni WHERE id = $1';
    } else if (decoded.role === 'faculty') {
      userQuery = 'SELECT id, full_name, email, role FROM faculty WHERE id = $1';
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const result = await pool.query(userQuery, [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      ...result.rows[0]
    };

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(401).json({ error: "Not authorized" });
  }
}; 