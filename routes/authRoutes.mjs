import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // ✅ Import dotenv
import User from '../models/User.mjs'; // ✅ Ensure the User model exists






dotenv.config(); // ✅ Load environment variables

const router = express.Router();

// ✅ Function to generate JWT Token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in .env');
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d', // Default to 7 days
    });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // ✅ Validate input
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // ✅ Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Save the user
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();

        // ✅ Generate Token
        const token = generateToken(newUser._id);

        res.status(201).json({ 
            token, 
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                username: newUser.username, 
                email: newUser.email 
            } 
        });

    } catch (err) {
        console.error("🔴 Registration Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        console.log("🟢 Login attempt:", req.body);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful");
        res.json({ token, user });
    } catch (err) {
        console.error("🔴 Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
