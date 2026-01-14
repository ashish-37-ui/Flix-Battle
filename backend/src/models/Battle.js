const mongoose = require("mongoose");

/**
 * Battle Schema
 * This defines the structure of a Battle document in MongoDB
 */
const battleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["movies", "actors", "tv", "singers", "custom"],
      required: true,
    },

    optionA: {
      type: String,
      required: true,
    },

    optionB: {
      type: String,
      required: true,
    },

    votesA: {
      type: Number,
      default: 0,
    },

    votesB: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String, // later this will be a User ID
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Battle", battleSchema);
