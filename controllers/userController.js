const User = require("../models/User");

// Get user data based on role (HOD, Admin, etc.)
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Fetch user data without password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "HOD") {
      const students = await User.find({ role: "Student", department: user.department }).select("-password");
      return res.status(200).json({ user, students });
    }

    if (user.role === "Admin") {
      const hods = await User.find({ role: "HOD" });
      const hodsWithStudents = await Promise.all(
        hods.map(async (hod) => {
          const students = await User.find({ role: "Student", department: hod.department }).select("-password");
          return { hod, students };
        })
      );
      return res.status(200).json({ user, hods: hodsWithStudents });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getDeptStudents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || user.role !== "HOD") {
      return res.status(403).json({ message: "Access denied. HODs only." });
    }

    const students = await User.find({ role: "Student", department: user.department }).select("-password");

    res.status(200).json({ user, students });
  } catch (error) {
    console.error("Error fetching department students:", error);
    res.status(500).json({ message: "Server error" });
  }
};




const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await User.findById(studentId);
    const user = await User.findById(req.user.id).select("-password");
    console.log("student",student)
    console.log("user",user)
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the user role to debug
    console.log("Requesting user role:", user.role, user.department, student.department);

    // Ensure only Admins or HODs can delete students
    if (user.role !== "Admin" && req.user.role !== "HOD") {
      console.log("anu error")

      return res.status(403).json({ message: "You are not authorized to delete students" });
    }

    // Check if the HOD is deleting students from their department
    if (user.role === "HOD" && student.department !== user.department) {
      console.log("any error")
      
      return res.status(403).json({ message: "You can only delete students from your department" });
    }

    await User.findByIdAndDelete(studentId);
    console.log("deleted")
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    return res.status(500).json({ message: "Failed to delete student due to server error" });
  }
};

const deleteHod = async (req, res) => {
  try {
    const hodId = req.params.hodId;
    const hod = await User.findById(hodId);
    console.log(hod , hodId)
    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    // Ensure only Admins can delete HODs
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "You are not authorized to delete HODs" });
    }

    // Delete the HOD
    await User.findByIdAndDelete(hodId);

    // Optionally, reset department for students under this HOD, if needed

    res.status(200).json({ message: "HOD deleted successfully" });
  } catch (err) {
    console.error("Error deleting HOD:", err);
    res.status(500).json({ message: "Failed to delete HOD" });
  }
};

const checkHODExistence = async (req, res) => {
  try {
    const { department } = req.params; // Extract department from params

    // Find if an HOD already exists in the specified department
    const existingHOD = await User.findOne({ role: "HOD", department });

    if (existingHOD) {
      return res.status(200).json({ exists: true }); // HOD exists
    }
    return res.status(200).json({ exists: false }); // No HOD found
  } catch (error) {
    return res.status(500).json({ message: "Error checking HOD existence" });
  }
};


// Admin dashboard route
const adminDashboard = async (req, res) => {
  try {
    // Only Admin should be able to access this route
    const user = req.user; // We have the user from the middleware

    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch required data for Admin dashboard (like HODs, etc.)
    const hods = await User.find({ role: "HOD" });

    res.status(200).json({ hods }); // You can customize this as per your requirements
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data" });
  }
};

module.exports = {
  adminDashboard,
};



module.exports = { getUserData, deleteStudent, deleteHod, checkHODExistence , adminDashboard ,getDeptStudents,getProfile };
