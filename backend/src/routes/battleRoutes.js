const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Battle = require("../models/Battle");

/**
 * GET /api/battles
 * Fetch all battles (for Home & Trends)
 */
router.get("/", async (req, res) => {
  try {

      const { type } = req.query;

    // 🔹 Build filter dynamically
    const filter = type ? { type } : {};
    const battles = await Battle.find(filter).sort({ createdAt: -1 });

    const formattedBattles = battles.map((battle) => {
      const votesA = battle.votes.filter(v => v.option === "A").length;
      const votesB = battle.votes.filter(v => v.option === "B").length;

      return {
        _id: battle._id,
        title: battle.title,
        type: battle.type,
        optionA: battle.optionA,
        optionB: battle.optionB,
        totalVotes: votesA + votesB,
        createdAt: battle.createdAt,
      };
    });

    res.json({
      success: true,
      battles: formattedBattles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch battles",
    });
  }
});


/**
 * GET /api/battles/:id
 * Fetch single battle + derived votes + userVote
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid battle ID",
    });
  }

  try {
    const battle = await Battle.findById(id);

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    // 🔹 Derive votes from votes array
    const votesA = battle.votes.filter(v => v.option === "A").length;
    const votesB = battle.votes.filter(v => v.option === "B").length;

    // 🔹 Find user's vote (if logged in)
    let userVote = null;
    if (userId) {
      const found = battle.votes.find(v => v.userId === userId);
      if (found) userVote = found.option;
    }

    res.json({
      success: true,
      battle,
      votes: {
        A: votesA,
        B: votesB,
      },
      userVote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch battle",
    });
  }
});


/**
 * POST /api/battles
 * Create new battle
 */
router.post("/", async (req, res) => {
  try {
    const { title, type, optionA, optionB, createdBy } = req.body;

    if (!title || !type || !optionA || !optionB) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const battle = await Battle.create({
      title,
      type,
      optionA,
      optionB,
      createdBy,
      votes: [],
    });

    res.status(201).json({
      success: true,
      battle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create battle",
    });
  }
});

/**
 * POST /api/battles/:id/vote
 */
/**
 * POST /api/battles/:id/vote
 * Enforces one vote per user per battle
 */
router.post("/:id/vote", async (req, res) => {
  const { option, userId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!["A", "B"].includes(option)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vote option",
    });
  }

  try {
    const battle = await Battle.findById(req.params.id);

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    // Check if user already voted
    const existingVote = battle.votes.find(
      (vote) => vote.userId === userId
    );

    if (existingVote) {
      // Update vote (allowed)
      existingVote.option = option;
    } else {
      // New vote
      battle.votes.push({ userId, option });
    }

    await battle.save();

    // Derive counts (single source of truth)
    const votesA = battle.votes.filter(v => v.option === "A").length;
    const votesB = battle.votes.filter(v => v.option === "B").length;

    res.json({
      success: true,
      votes: {
        A: votesA,
        B: votesB,
      },
      userVote: option,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Vote failed",
    });
  }
});

/**
 * POST /api/battles/:id/opinion
 */
router.post("/:id/opinion", async (req, res) => {
  const { userId, option, text } = req.body;

  if (!userId || !option || !text) {
    return res.status(400).json({
      success: false,
      message: "Missing opinion data",
    });
  }

  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) {
      return res.status(404).json({
        success: false,
        message: "Battle not found",
      });
    }

    const alreadyPosted = battle.opinions.find(
      (op) => op.userId === userId
    );

    if (alreadyPosted) {
      return res.status(400).json({
        success: false,
        message: "Opinion already submitted",
      });
    }

    battle.opinions.push({
      id: Date.now().toString(),
      userId,
      option,
      text,
      likes: [],
    });

    await battle.save();

    res.json({
      success: true,
      opinions: battle.opinions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit opinion",
    });
  }
});

/**
 * POST /api/battles/:id/opinion/:opinionId/like
 */
router.post("/:id/opinion/:opinionId/like", async (req, res) => {
  const { userId } = req.body;

  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) {
      return res.status(404).json({ success: false });
    }

    const opinion = battle.opinions.find(
      (op) => op.id === req.params.opinionId
    );

    if (!opinion || opinion.likes.includes(userId)) {
      return res.json({ success: true });
    }

    opinion.likes.push(userId);
    await battle.save();

    res.json({
      success: true,
      opinions: battle.opinions,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



module.exports = router;
