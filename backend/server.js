import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { doubleCsrf } from "csrf-csrf";
import authRoutes from "./routes/auth.routes.js";
import pool from "./db/db.js";
import { createTables } from "./db/schema.js";
import { validateEnv, getEnv, getRequiredEnv } from "./utils/env.js";

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'CSRF_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

// Validate environment variables
validateEnv(requiredEnvVars);

const app = express();

// Use environment variables with defaults where appropriate
const PORT = getEnv('PORT', 5001);
const CLIENT_URL = getEnv('CLIENT_URL', 'http://localhost:3000');
const NODE_ENV = getEnv('NODE_ENV', 'development');

console.log('Server configuration:');
console.log('PORT:', PORT);
console.log('CLIENT_URL:', CLIENT_URL);
console.log('NODE_ENV:', NODE_ENV);

// Initialize CSRF protection
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => getRequiredEnv('CSRF_SECRET'),
});

// Database connection and schema initialization
async function connectDB() {
    try {
        await pool.connect();
        console.log(' Connected to PostgreSQL database');
        
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
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: getRequiredEnv('JWT_SECRET'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// CORS setup with credentials enabled
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [CLIENT_URL] 
    : ["http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token'],
  exposedHeaders: ['set-cookie'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log('----------------------------------------');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('----------------------------------------');
  next();
});

// Add CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
});

// Apply CSRF protection to all routes except GET requests
app.use((req, res, next) => {
  if (req.method === 'GET') {
    next();
  } else {
    doubleCsrfProtection(req, res, next);
  }
});

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Server also accessible at http://43.204.96.201:${PORT}`);
});
