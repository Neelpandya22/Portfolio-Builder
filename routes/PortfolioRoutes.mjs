import express from "express";
import Portfolio from "../models/portfolio.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";

const router = express.Router();

// 🔹 Create Portfolio
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, theme, description } = req.body;
    const newPortfolio = await Portfolio.create({
      userId: req.user.id,
      title,
      theme,
      description,
    });

    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// 🔹 Get Portfolios of a User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;