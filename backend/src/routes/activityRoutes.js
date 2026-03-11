
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

/**
 * GET /api/activity
 * returns latest 10 activities
 */
router.get("/", async (req, res) => {
  try {

    const activity = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      activity
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity"
    });
  }
});

module.exports = router;

