const User = require("../models/User"); // Import User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;

    // Validate fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      department: role === "Admin" ? null : department, // Only include department for specific roles
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role , email: user.email , username: user.username },
      "ram",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Token = require("../models/tokenModel");

// Logout User
const logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid token." });
    }

    // Add token to the blacklist
    const blacklistedToken = new Token({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Convert expiration time to milliseconds
    });

    await blacklistedToken.save();
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during logout." });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
