const User = require("../models/User");

async function getOrCreateUser({ userId, username }) {
  let user = await User.findOne({ userId });

  if (!user) {
    user = await User.create({
      userId,
      username: username || userId,
      createdBattles: [],
      votedBattles: [],
      savedBattles: [],
    });
  }

  return user;
}

module.exports = getOrCreateUser;
