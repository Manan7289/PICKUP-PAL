const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  password: String,
  role: { type: String, default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);