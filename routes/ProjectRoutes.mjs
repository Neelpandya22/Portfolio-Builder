import express from "express";
import Project from "../models/Project.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";

const router = express.Router();

// 🔹 Create a Project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { portfolioId, title, description, techStack, githubLink, liveLink } = req.body;
    const newProject = await Project.create({
      portfolioId,
      title,
      description,
      techStack,
      githubLink,
      liveLink,
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// 🔹 Get Projects of a Portfolio
router.get("/:portfolioId", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ portfolioId: req.params.portfolioId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;