const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: {
    type: [String],
    default: function () {
      switch (this.name) {
        case "Admin":
          return ["create", "update", "delete", "read"];
        case "Student":
          return ["read"];
        case "HOD":
          return ["create", "update", "read"];
        default:
          return [];
      }
    },
  },
});


module.exports = mongoose.model("Role", RoleSchema);
