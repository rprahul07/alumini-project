// unit test -- auth.middleware.test.js
import { protect } from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";

jest.mock("jsonwebtoken");
jest.mock("../db/db.js", () => ({
  query: jest.fn()
}));

describe("auth.middleware.protect", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("401 if no token present", async () => {
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("401 if jwt.verify throws JsonWebTokenError", async () => {
    req.cookies.jwt = "badtoken";
    jwt.verify.mockImplementation(() => { 
      const err = new Error("invalid"); err.name = "JsonWebTokenError"; 
      throw err;
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("401 if jwt.verify throws TokenExpiredError", async () => {
    req.cookies.jwt = "expiredtoken";
    jwt.verify.mockImplementation(() => { 
      const err = new Error("expired"); err.name = "TokenExpiredError"; 
      throw err;
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token expired" });
    expect(next).not.toHaveBeenCalled();
  });

  it("400 if decoded.role is invalid", async () => {
    req.cookies.jwt = "sometoken";
    jwt.verify.mockReturnValue({ id: 1, role: "unknown" });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid role" });
    expect(next).not.toHaveBeenCalled();
  });

  it("401 if user no longer exists", async () => {
    req.cookies.jwt = "validtoken";
    jwt.verify.mockReturnValue({ id: 2, role: "student" });
    pool.query.mockResolvedValueOnce({ rows: [] });

    await protect(req, res, next);
    expect(pool.query).toHaveBeenCalledWith("SELECT id FROM students WHERE id = $1", [2]);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User no longer exists" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() and attaches req.user on success (student)", async () => {
    req.cookies.jwt = "validtoken";
    jwt.verify.mockReturnValue({ id: 3, role: "student" });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3 }] });

    await protect(req, res, next);
    expect(req.user).toEqual({ id: 3, role: "student" });
    expect(next).toHaveBeenCalled();
  });

  it("calls next() and attaches req.user on success (alumni)", async () => {
    req.cookies.jwt = "validtoken";
    jwt.verify.mockReturnValue({ id: 4, role: "alumni" });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 4 }] });

    await protect(req, res, next);
    expect(pool.query).toHaveBeenCalledWith("SELECT id FROM alumni WHERE id = $1", [4]);
    expect(req.user).toEqual({ id: 4, role: "alumni" });
    expect(next).toHaveBeenCalled();
  });

  it("calls next() and attaches req.user on success (faculty)", async () => {
    req.cookies.jwt = "validtoken";
    jwt.verify.mockReturnValue({ id: 5, role: "faculty" });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5 }] });

    await protect(req, res, next);
    expect(pool.query).toHaveBeenCalledWith("SELECT id FROM faculty WHERE id = $1", [5]);
    expect(req.user).toEqual({ id: 5, role: "faculty" });
    expect(next).toHaveBeenCalled();
  });
});
