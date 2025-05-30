// unit test -- enerateTocken.test.js
import jwt from "jsonwebtoken";
import generateTokenAndSetCookie from "../utils/generateTocken.js";

jest.mock("jsonwebtoken");

describe("generateTokenAndSetCookie utility", () => {
  it("should generate a JWT and set cookie with correct options", () => {
    const mockSign = jwt.sign;
    const mockRes = {
      cookie: jest.fn(),
    };

    // Mock the jwt.sign method to return a dummy token
    mockSign.mockReturnValue("mocked.jwt.token");

    const userId = 123;
    const role = "student";

    generateTokenAndSetCookie(userId, role, mockRes);

    // Check if jwt.sign was called with correct payload and secret
    expect(mockSign).toHaveBeenCalledWith(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    // Check if cookie was set with correct name, value, and options
    expect(mockRes.cookie).toHaveBeenCalledWith("jwt", "mocked.jwt.token", {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
  });
});
