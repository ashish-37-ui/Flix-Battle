const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // important
    },
    username: {
      type: String,
      required: true,
    },

    // activity tracking
    createdBattles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Battle",
      default: [],
    },

    votedBattles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Battle",
      default: [],
    },

    savedBattles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Battle",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
