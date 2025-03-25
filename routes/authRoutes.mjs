import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.mjs"; // ✅ Ensure this model is correctly imported

dotenv.config();

const router = express.Router();

// ✅ Function to generate JWT Token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("🔴 Error: JWT_SECRET is not defined in .env");
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Default to 7 days if not set
  });
};

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // ✅ Validate input
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase();

    // ✅ Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === normalizedEmail
          ? "Email already registered"
          : "Username already taken",
      });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save the new user
    const newUser = new User({
      name,
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate Token
    const token = generateToken(newUser._id);

    console.log("✅ New user registered:", newUser.email);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("🔴 Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("🟢 Login attempt:", req.body);

    const { email, password } = req.body;

    // ✅ Convert email to lowercase for case-insensitive login
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("❌ User not found:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = generateToken(user._id);

    console.log("✅ Login successful:", user.email);
    res.json({ token, user });
  } catch (err) {
    console.error("🔴 Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
