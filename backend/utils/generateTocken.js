import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, role, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Secure in prod
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // None in prod for cross-site
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateTokenAndSetCookie;
