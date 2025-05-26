import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
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
        
        // Create tables if they don't exist
        await createTables();
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

// Initialize database connection
connectDB();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// CORS setup with credentials enabled
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // Enable credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
