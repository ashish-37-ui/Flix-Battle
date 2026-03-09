
const mongoose = require("mongoose");

const BattleSchema = new mongoose.Schema(
  {
    // 🔹 Core battle info
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["movies", "actors", "tv", "singers"],
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

    createdBy: {
      type: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // 🗳️ VOTES (one per user)
    votes: [
      {
        userId: {
          type: String,
          required: true,
        },
        option: {
          type: String,
          enum: ["A", "B"],
          required: true,
        },
      },
    ],

    // 💬 OPINIONS (one per user)
    opinions: [
      {
        id: {
          type: String,
          required: true,
        },

        userId: {
          type: String,
          required: true,
        },

        option: {
          type: String,
          enum: ["A", "B"],
          required: true,
        },

        text: {
          type: String,
          required: true,
          maxlength: 200,
        },

        likes: {
          type: [String], // userIds
          default: [],
        },

        // ⭐ REPLIES (nested discussion)
        replies: [
          {
            id: {
              type: String,
              required: true,
            },

            userId: {
              type: String,
              required: true,
            },

            text: {
              type: String,
              required: true,
              maxlength: 200,
            },

            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Battle", BattleSchema);

