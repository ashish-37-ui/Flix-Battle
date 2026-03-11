
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["battle", "vote", "opinion", "reply", "like"],
      required: true,
    },

    userId: String,
    username: String,

    battleId: String,
    battleTitle: String,

  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);

