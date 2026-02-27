const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Battle = require("../models/Battle");
const getOrCreateUser = require("../utils/getOrCreateUser");
const User = require("../models/User");

/**
 * GET /api/battles
 * Fetch all battles (for Home & Trends)
 */
/**
 * GET /api/battles
 * Supports:
 *  - category filter (?type=movies)
 *  - search (?q=interstellar)
 */
router.get("/", async (req, res) => {
  try {
    const { type, q } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { optionA: { $regex: q, $options: "i" } },
        { optionB: { $regex: q, $options: "i" } },
      ];
    }

    const battles = await Battle.find(filter);

    const now = new Date();

    const enhancedBattles = battles.map((battle) => {
      const votesA = battle.votes.filter(v => v.option === "A").length;
      const votesB = battle.votes.filter(v => v.option === "B").length;
      const totalVotes = votesA + votesB;

      const opinionCount = battle.opinions.length;

      const hoursOld =
        (now - new Date(battle.createdAt)) / (1000 * 60 * 60);

      const freshnessBoost = Math.max(24 - hoursOld, 0);

      const trendingScore =
        (totalVotes * 2) +
        (opinionCount * 3) +
        freshnessBoost;

      return {
        _id: battle._id,
        title: battle.title,
        type: battle.type,
        optionA: battle.optionA,
        optionB: battle.optionB,
        totalVotes,
        createdAt: battle.createdAt,
        trendingScore,
        opinionCount,
        
      };
    });

    // 🔥 SORT BY SMART SCORE
    enhancedBattles.sort((a, b) => b.trendingScore - a.trendingScore);

    res.json({
      success: true,
      battles: enhancedBattles,
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

    const votesA = battle.votes.filter((v) => v.option === "A").length;
    const votesB = battle.votes.filter((v) => v.option === "B").length;

    let userVote = null;
    let isSaved = false;

    if (userId) {
      const user = await User.findOne({ userId });

      if (user) {
        const vote = battle.votes.find((v) => v.userId === userId);
        if (vote) userVote = vote.option;

        isSaved = user.savedBattles.some(
          (bId) => bId.toString() === battle._id.toString(),
        );
      }
    }

    res.json({
      success: true,
      battle,
      votes: { A: votesA, B: votesB },
      userVote,
      isSaved, // ✅ SINGLE SOURCE OF TRUTH
    });
  } catch (err) {
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
    const { title, type, optionA, optionB, createdBy, username } = req.body;

    if (!title || !type || !optionA || !optionB || !createdBy) {
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
      opinions: [],
    });

    const user = await getOrCreateUser({
      userId: createdBy,
      username: username || createdBy,
    });

    // 3️⃣ Track created battle (IMPORTANT)
    if (!user.createdBattles.includes(battle._id)) {
      user.createdBattles.push(battle._id);
      await user.save();
    }

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
  const { option, userId, username } = req.body;

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

    const existingVote = battle.votes.find((v) => v.userId === userId);
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this battle",
      });
    }

    const user = await getOrCreateUser({
      userId,
      username: username || userId,
    });

    battle.votes.push({ userId, option });
    await battle.save();

    if (!user.votedBattles.includes(battle._id)) {
      user.votedBattles.push(battle._id);
      await user.save();
    }

    const votesA = battle.votes.filter((v) => v.option === "A").length;
    const votesB = battle.votes.filter((v) => v.option === "B").length;

    res.json({
      success: true,
      votes: { A: votesA, B: votesB },
      userVote: option,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Vote failed",
    });
  }
});

/**
 * POST /api/battles/:id/opinion
 */
router.post("/:id/vote", async (req, res) => {
  const { option, userId, username } = req.body;

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

    const existingVote = battle.votes.find((vote) => vote.userId === userId);

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted on this battle",
      });
    }

    // ✅ Auto-create user (Option A)
    const user = await getOrCreateUser({
      userId,
      username: username || userId,
    });

    // 🗳️ Save vote
    battle.votes.push({ userId, option });
    await battle.save();

    // 👤 Track voted battle
    if (!user.votedBattles.includes(battle._id)) {
      user.votedBattles.push(battle._id);
      await user.save();
    }

    const votesA = battle.votes.filter((v) => v.option === "A").length;
    const votesB = battle.votes.filter((v) => v.option === "B").length;

    res.json({
      success: true,
      votes: { A: votesA, B: votesB },
      userVote: option,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Vote failed",
    });
  }
});

router.post("/:id/save", async (req, res) => {
  const { userId, username } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
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

    const user = await getOrCreateUser({ userId, username });

    const battleIdStr = battle._id.toString();

    const index = user.savedBattles.findIndex(
      (id) => id.toString() === battleIdStr
    );

    let saved;

    if (index !== -1) {
      // 🔥 REMOVE
      user.savedBattles.splice(index, 1);
      saved = false;
    } else {
      // ⭐ ADD
      user.savedBattles.push(battle._id);
      saved = true;
    }

    await user.save();

    res.json({
      success: true,
      saved,
    });
  } catch (err) {
    console.error("Save toggle failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to toggle save",
    });
  }
});


/**
 * POST /api/battles/:id/opinion
 * Submit opinion (one per user)
 */
router.post("/:id/opinion", async (req, res) => {
  const { userId, option, text } = req.body;

  if (!userId || !option || !text) {
    return res.status(400).json({
      success: false,
      message: "Missing opinion data",
    });
  }

  if (!["A", "B"].includes(option)) {
    return res.status(400).json({
      success: false,
      message: "Invalid option",
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

    // ❌ Only one opinion per user
    const alreadyPosted = battle.opinions.find(
      (op) => op.userId === userId
    );

    if (alreadyPosted) {
      return res.status(400).json({
        success: false,
        message: "Opinion already submitted",
      });
    }

    // ✅ Save opinion
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
    console.error("Opinion error:", err);
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
      (op) => op.id === req.params.opinionId,
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
