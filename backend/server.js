import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authentication_routes.js";
import adminRouter from "./routes/admin_routes.js";
import facultyRouter from "./routes/faculty_routes.js";
import publicRouter from "./routes/public_routes.js";
import studentRouter from "./routes/student_routes.js";
import alumniRouter from "./routes/alumni_routes.js";
import { AppError } from "./utils/response.utils.js";

// Load environment variables
dotenv.config();
console.log("Environment variables loaded");

// Force port 5001
const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Updated to match Vite's default port

console.log(`Server configuration: PORT=${PORT}, CLIENT_URL=${CLIENT_URL}`);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  next();
});

// CORS configuration
const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// CSRF token route
app.get("/api/csrf-token", (req, res) => {
  console.log("CSRF token requested");
  res.json({ csrfToken: "dummy-csrf-token" });
});

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/alumni", alumniRouter);
app.use("/api/student", studentRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api/public", publicRouter);

// Error handler for Prisma errors
app.use((err, req, res, next) => {
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    code: err.code,
    meta: err.meta,
    stack: err.stack,
  });

  // Handle Prisma-specific errors
  if (err.code?.startsWith("P")) {
    console.error("Prisma error:", err);
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
      error:
        process.env.NODE_ENV === "development"
          ? {
              code: err.code,
              message: err.message,
              meta: err.meta,
            }
          : "Database operation failed",
    });
  }

  // Handle validation errors
  if (err instanceof AppError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle other errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? {
            message: err.message,
            stack: err.stack,
          }
        : "An unexpected error occurred",
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: "Not Found" });
});

// Start server
const server = app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS enabled for origin: ${CLIENT_URL}`);
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please free up the port and try again.`
      );
    } else {
      console.error("Failed to start server:", error);
    }
    process.exit(1);
  });

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
