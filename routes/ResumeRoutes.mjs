import express from "express";
import Resume from "../models/Resume.mjs"; // ✅ Correct path

const router = express.Router();

// ✅ Get all resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a resume
router.post("/", async (req, res) => {
  try {
    const { userId, skills, experience, education } = req.body;
    const newResume = new Resume({ userId, skills, experience, education });
    await newResume.save();
    res.status(201).json(newResume);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
