import express from "express";
import Portfolio from "../models/Portfolio.mjs";

const router = express.Router();

// ✅ Get all portfolios
router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a portfolio
router.post("/", async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const newPortfolio = new Portfolio({ userId, title, description });
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
