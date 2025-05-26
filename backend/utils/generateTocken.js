import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const tocken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", tocken, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //Milisec
    httpOnly: true, //prevent XXS attcks cross-site scripting attacks
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "develoupment",
  });
};

export default generateTokenAndSetCookie;
