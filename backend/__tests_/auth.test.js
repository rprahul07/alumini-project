//integration-Test

import request from "supertest";
import pool from '../db/db.js';
import app from '../server.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Authentication Tests", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM students");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM students");
    await pool.end();
  });

  test("Register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        full_name: "Test User",
        email: "testuser@example.com",
        password: "testpassword",
        phone_number: "1234567890",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  test("Login an existing user", async () => {
    const passwordHash = await bcrypt.hash("testpassword", 10);
    await pool.query(
      "INSERT INTO students (full_name, email, password) VALUES ($1, $2, $3)",
      ["Login User", "loginuser@example.com", passwordHash]
    );

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser@example.com",
        password: "testpassword",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Check authenticated user (checkAuth)", async () => {
    const passwordHash = await bcrypt.hash("checkauthpass", 10);
    const userRes = await pool.query(
      "INSERT INTO students (full_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      ["Check Auth User", "checkauth@example.com", passwordHash]
    );
    const user = userRes.rows[0];

    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const res = await request(app)
      .get("/api/auth/check")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    });
  });
});
