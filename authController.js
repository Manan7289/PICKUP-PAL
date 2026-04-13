const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
  try {
    const { name, age, email, phone, address, password } = req.body;

    // ✅ Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, Email and Password are required" });
    }

    // ✅ Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user safely
    const user = await User.create({
      name,
      age: age || null,
      email,
      phone: phone || "",
      address: address || "",
      password: hashedPassword
    });

    res.status(201).json({
      msg: "User registered successfully",
      user
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error); // 🔥 IMPORTANT DEBUG
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error); // 🔥 IMPORTANT DEBUG
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser, loginUser };