const express = require("express");
const router = express.Router();

/**
 * @route   GET /api/battles
 * @desc    Test battle endpoint
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Battle API is working 🚀",
    battles: [],
  });
});

module.exports = router;
