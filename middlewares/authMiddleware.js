const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

const authMiddleware =async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  

  try {
    const blacklistedToken = await Token.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
    }
    const decoded = jwt.verify(token, "ram");
    req.user = decoded; // Attach user data (including role) to request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authMiddleware };
