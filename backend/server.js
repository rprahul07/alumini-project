import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "@dr.pogodin/csurf";
import authRoutes from "./routes/auth.routes.js";
import pool from "./db/db.js";
import { createTables } from "./db/schema.js";

// Load environment variables
dotenv.config();

const app = express();

// Use environment variables
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Database connection and schema initialization
async function connectDB() {
    try {
        await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        await createTables();
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

connectDB();

// Basic middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// CSRF Protection setup
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: '/'
  }
});

// CORS setup with credentials enabled
app.use(
  cors({
    origin: ["http://43.204.96.201", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token'],
    exposedHeaders: ['set-cookie']
  })
);

// CSRF token endpoint - must be before CSRF protection
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: '/'
  });
  res.json({ csrfToken: token });
});

// Apply CSRF protection to all routes except GET requests
app.use((req, res, next) => {
  if (req.method === 'GET') {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: 'Invalid CSRF token. Please refresh the page and try again.'
    });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
