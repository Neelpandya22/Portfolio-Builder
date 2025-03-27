import express from "express";
import Project from "../models/Project.mjs"; // ✅ Correct path

const router = express.Router();

// ✅ Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a project
router.post("/", async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const newProject = new Project({ userId, title, description });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
