// routes/authRoutes.mjs
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.mjs"; // Ensure correct import path

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
    let { name, username, email, password } = req.body;

    // ✅ Validate input
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Sanitize inputs
    email = email.trim().toLowerCase();
    username = username.trim();
    password = password.trim();

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // ✅ Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email already registered" : "Username already taken",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ Create new user
    const newUser = new User({
      name,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    // ✅ Save user in DB
    await newUser.save();
    
    console.log("✅ User saved successfully:", newUser);

    // ✅ Generate JWT Token
    const token = generateToken(newUser._id);

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
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("🟢 Login attempt:", email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Ensure email is in correct format
    email = email.trim().toLowerCase();

    // ✅ Find user in DB
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);
    
    // ✅ Debug bcrypt password check
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔎 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Incorrect password for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = generateToken(user._id);
    console.log("✅ Login successful:", user.email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔴 Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
