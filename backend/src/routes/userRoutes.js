const express = require("express");
const router = express.Router();
const Battle = require("../models/Battle");

/**
 * GET /api/users/:userId/activity
 * Fetch battles created by user + battles voted by user
 */
router.get("/:userId/activity", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID required",
    });
  }

  try {
    // 🔥 Battles created by user
    const createdBattles = await Battle.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .select("_id title type optionA optionB createdAt");

    // 🗳️ Battles user voted on
    const votedBattles = await Battle.find({
      "votes.userId": userId,
    })
      .sort({ updatedAt: -1 })
      .select("_id title type optionA optionB updatedAt");

    res.json({
      success: true,
      createdBattles,
      votedBattles,
    });
  } catch (error) {
    console.error("User activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
    });
  }
});

module.exports = router;
