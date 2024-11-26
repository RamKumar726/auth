const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
