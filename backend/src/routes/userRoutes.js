const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * GET /api/users/:userId/activity
 * Created, Voted, Saved battles
 */
router.get("/:userId/activity", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId })
      .populate("createdBattles")
      .populate("votedBattles")
      .populate("savedBattles");

    if (!user) {
      return res.json({
        success: true,
        createdBattles: [],
        votedBattles: [],
        savedBattles: [],
      });
    }

    res.json({
      success: true,
      createdBattles: user.createdBattles,
      votedBattles: user.votedBattles,
      savedBattles: user.savedBattles,
    });
  } catch (err) {
    console.error("User activity error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load user activity",
    });
  }
});

module.exports = router;
