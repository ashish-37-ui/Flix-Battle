
const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");


/**
 * GET /api/notifications/:userId
 * Fetch notifications for a user
 */
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      

    res.json({
      success: true,
      notifications,
    });
  }
  catch (err) {
  console.error("Notification fetch error:", err);

  res.status(500).json({
    success: false,
    message: "Failed to fetch notifications",
    error: err.message
  });
} 

});

/**
 * POST mark notification as read
 */
router.post("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post("/:userId/read", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { read: true }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;

