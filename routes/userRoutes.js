const express = require("express");
const {
  getProfile,
  getUserData,
  getDeptStudents,
  deleteHod,
  deleteStudent,
  checkHODExistence,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Route to fetch logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// Admin route to fetch all data
router.get("/admin", authMiddleware, roleMiddleware(["Admin"]), getUserData);

// HOD route to fetch students from their department
router.get("/hod/students", authMiddleware, roleMiddleware(["HOD"]), getDeptStudents);

// Route to delete student (accessible by Admin and HOD)
router.delete("/students/:studentId", authMiddleware, roleMiddleware(["Admin", "HOD"]), deleteStudent);

// Route to delete HOD (only accessible by Admin)
router.delete("/hods/:hodId", authMiddleware, roleMiddleware(["Admin"]), deleteHod);

// Route to check if HOD exists in a department
router.get("/hods/:department", checkHODExistence);

module.exports = router;
