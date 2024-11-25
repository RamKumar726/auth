const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/auth_db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error: ", err));

module.exports = mongoose;
