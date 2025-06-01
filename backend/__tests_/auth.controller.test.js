// unit test -- auth.controller.unit.test.js
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import pool from "../db/db.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTocken.js";

// 1) Mock everything external to the controller
jest.mock("../db/db.js", () => ({
  query: jest.fn()
}));
jest.mock("bcryptjs");
jest.mock("../utils/generateTocken.js");

describe("Auth Controller (unit)", () => {
  let req, res;

  beforeEach(() => {
    // fresh req/res for each test
    req = { body: {}, cookies: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe("signup()", () => {
    it("400 if required fields missing", async () => {
      req.body = { email: "a@b.com" };
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Please fill in all required fields" });
    });

    it("400 if passwords don't match", async () => {
      req.body = {
        fullName: "A",
        email: "a@b.com",
        phoneNumber: "123",
        password: "Pass1!",
        confirmPassword: "Pass2!",
        role: "student"
      };
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Passwords don't match" });
    });

    it("400 if password too weak", async () => {
      req.body = {
        fullName: "A",
        email: "a@b.com",
        phoneNumber: "123",
        password: "weak",
        confirmPassword: "weak",
        role: "student"
      };
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining("Password must be at least 12 characters")
      }));
    });

    it("409 if email already exists", async () => {
      req.body = {
        fullName: "A",
        email: "a@b.com",
        phoneNumber: "123",
        password: "StrongPass123!",
        confirmPassword: "StrongPass123!",
        role: "student"
      };
      // simulate checkIfEmailExists → true
      pool.query.mockResolvedValueOnce({ rows: [{ email: "a@b.com" }] });
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
    });

    it("201 on valid student signup", async () => {
      req.body = {
        fullName: "A",
        email: "a@b.com",
        phoneNumber: "123",
        password: "StrongPass123!",
        confirmPassword: "StrongPass123!",
        role: "student",
        department: "CS",
        currentSemester: "1",
        rollNumber: "001"
      };
      // simulate no existing email
      pool.query
        .mockResolvedValueOnce({ rows: [] })   // checkIfEmailExists
        .mockResolvedValueOnce({ rows: [{ id: 5, full_name: "A", email: "a@b.com" }] }); // insert
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed");
      generateTokenAndSetCookie.mockImplementation(() => {});

      await signup(req, res);

      // Query calls
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("SELECT email"),
        [req.body.email]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO students"),
        expect.any(Array)
      );
      // Token & response
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(5, "student", res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 5,
        fullName: "A",
        email: "a@b.com",
        role: "student"
      });
    });
  });

  describe("login()", () => {
    it("400 if user not found", async () => {
      req.body = { email: "x@x.com", password: "p", role: "student" };
      pool.query.mockResolvedValueOnce({ rows: [] });
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email or password" });
    });

    it("400 if password incorrect", async () => {
      req.body = { email: "x@x.com", password: "wrong", role: "student" };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 2, password: "hash" }] });
      bcrypt.compare.mockResolvedValue(false);
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email or password" });
    });

    it("200 and set cookie on correct credentials", async () => {
      req.body = { email: "x@x.com", password: "right", role: "student" };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 2, full_name: "Bob", email: "x@x.com", password: "hash" }] });
      bcrypt.compare.mockResolvedValue(true);
      generateTokenAndSetCookie.mockImplementation(() => {});
      await login(req, res);
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(2, "student", res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: 2,
        fullName: "Bob",
        email: "x@x.com",
        role: "student"
      });
    });
  });

  describe("logout()", () => {
    it("clears cookie and returns 200", () => {
      logout(req, res);
      expect(res.cookie).toHaveBeenCalledWith("jwt", "", expect.objectContaining({ maxAge: 0, httpOnly: true }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });

  describe("checkAuth()", () => {
    it("401 if not authenticated", async () => {
      req.user = null;
      await checkAuth(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Not authenticated" });
    });

    it("404 if user not found", async () => {
      req.user = { id: 3, role: "student" };
      pool.query.mockResolvedValueOnce({ rows: [] });
      await checkAuth(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("200 and user data if authenticated", async () => {
      req.user = { id: 3, role: "student" };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 3, full_name: "Bob", email: "bob@x.com" }] });
      await checkAuth(req, res);
      expect(res.json).toHaveBeenCalledWith({
        _id: 3,
        fullName: "Bob",
        email: "bob@x.com",
        role: "student"
      });
    });
  });
});
