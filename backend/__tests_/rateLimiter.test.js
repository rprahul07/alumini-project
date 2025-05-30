//  unit test -- rateLimiter.test.js
import express from 'express';
import request from 'supertest';
import { loginLimiter } from '../middleware/rateLimiter.js';  // adjust if path differs

describe("Login Rate Limiter Middleware", () => {
  let app;

  beforeEach(() => {
    // Create a fresh app and mount limiter + dummy handler
    app = express();
    app.use(express.json());
    app.post("/login", loginLimiter, (req, res) => {
      res.status(200).json({ message: "Login successful" });
    });
  });

  it("allows up to 5 requests, then blocks the 6th", async () => {
    // First 5 should pass
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/login");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "Login successful" });
    }

    // 6th should be rate‐limited
    const blocked = await request(app).post("/login");
    expect(blocked.statusCode).toBe(400);
    expect(blocked.body).toEqual({
      error: "Too many login attempts, please try again later."
    });
  });
});
