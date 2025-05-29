import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, role, res) => {
  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set secure cookie options
  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    path: "/", // Cookie is available for all paths
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};

export default generateTokenAndSetCookie; 