// unit test -- userModel.unit.test.js
import { findUserByEmailAndRole, checkIfEmailExists } from "../models/userModel.js";
import pool from "../db/db.js";

jest.mock("../db/db.js", () => ({
  query: jest.fn()
}));

describe("userModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByEmailAndRole", () => {
    it("queries the students table when role is 'student'", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: "a@b.com" }] });

      const user = await findUserByEmailAndRole("a@b.com", "student");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM students WHERE email = $1",
        ["a@b.com"]
      );
      expect(user).toEqual({ id: 1, email: "a@b.com" });
    });

    it("queries the alumni table when role is 'alumni'", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 2, email: "c@d.com" }] });

      const user = await findUserByEmailAndRole("c@d.com", "alumni");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM alumni WHERE email = $1",
        ["c@d.com"]
      );
      expect(user).toEqual({ id: 2, email: "c@d.com" });
    });

    it("queries the faculty table when role is 'faculty'", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 3, email: "e@f.com" }] });

      const user = await findUserByEmailAndRole("e@f.com", "faculty");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM faculty WHERE email = $1",
        ["e@f.com"]
      );
      expect(user).toEqual({ id: 3, email: "e@f.com" });
    });

    it("throws an error for an invalid role", async () => {
      await expect(
        findUserByEmailAndRole("x@y.com", "invalidRole")
      ).rejects.toThrow("Invalid role");
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe("checkIfEmailExists", () => {
    it("returns true if any table has the email", async () => {
      pool.query.mockResolvedValueOnce({ rows: ["a@b.com"] });

      const exists = await checkIfEmailExists("a@b.com");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT email FROM students"),
        ["a@b.com"]
      );
      expect(exists).toBe(true);
    });

    it("returns false if no table has the email", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const exists = await checkIfEmailExists("noone@example.com");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT email FROM students"),
        ["noone@example.com"]
      );
      expect(exists).toBe(false);
    });
  });
});
