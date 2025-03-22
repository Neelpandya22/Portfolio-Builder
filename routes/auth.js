import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed if using Node.js v16 or below
import { login } from '../api/auth';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Simulating an API request (for debugging or internal calls)
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.json())
    .then(data => console.log("Fetch Response:", data))
    .catch(error => console.error("Fetch Error:", error));

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
