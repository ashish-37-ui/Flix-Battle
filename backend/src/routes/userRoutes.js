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

// 🏆 GET TOP CREATORS
router.get("/leaderboard/top", async (req, res) => {
  try {
    const users = await User.find().populate("createdBattles");

    const leaderboard = users.map((user) => {
      let totalVotes = 0;
      let totalOpinions = 0;
      let battleCount = user.createdBattles.length;

      user.createdBattles.forEach((battle) => {
        totalVotes += battle.votes.length;
        totalOpinions += battle.opinions.length;
      });

      const score =
        (totalVotes * 2) +
        (totalOpinions * 3) +
        (battleCount * 1);

      return {
        userId: user.userId,
        username: user.username,
        battleCount,
        totalVotes,
        totalOpinions,
        score,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      leaderboard: leaderboard.slice(0, 5),
    });

  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
});

module.exports = router;
