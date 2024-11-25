const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Student", "HOD"], // Allowed user roles
    default: "Student", // Default role is 'Student'
    required: true,
  },
  department: {
    type: String,
    enum: ["ECE", "CSE", "IT", "MECH", "CIVIL"], // Allowed departments
    required: function () {
      // Only require the department if the role is 'Student' or 'HOD'
      return this.role === "Student" || this.role === "HOD";
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
