const express = require("express");
const router = express.Router();
const Battle = require("../models/Battle");

/**
 * GET /api/battles
 * Fetch all battles
 */
router.get("/", async (req, res) => {
  try {
    const battles = await Battle.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: battles.length,
      battles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch battles",
    });
  }
});

/**
 * POST /api/battles
 * Create a new battle
 */
router.post("/", async (req, res) => {
  try {
    const { title, type, optionA, optionB, createdBy } = req.body;

    // 🛑 Basic validation
    if (!title || !type || !optionA || !optionB || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Create battle in MongoDB
    const battle = await Battle.create({
      title,
      type,
      optionA,
      optionB,
      createdBy,
    });

    res.status(201).json({
      success: true,
      battle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create battle",
      error: error.message,
    });
  }
});

module.exports = router;
