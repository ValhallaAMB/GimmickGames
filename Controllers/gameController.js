// const mongoose = require("mongoose"); // Import Mongoose
// const ObjectId = mongoose.Types.ObjectId; // Access Mongoose's ObjectId

const renderSnakeGame = (req, res) => {
  // const _id = new ObjectId("6643ddd833742f0641edf21a"); // Instantiate Mongoose's ObjectId
  const userId = req.user ? req.user.id : null;
  const userName = req.user ? req.user.name : null;
  res.render("snakeGame", {
    name: userName,
    gameId: process.env.SNAKE_GAME_ID,
    userId: userId,
  });
};

const renderSnakeIndex = (req, res) => {
  // const _id = new ObjectId("6643ddd833742f0641edf21a"); // Instantiate Mongoose's ObjectId
  const userId = req.user ? req.user.id : null;
  res.render("snakeIndex", {
    gameId: process.env.SNAKE_GAME_ID,
    userId: userId,
  });
};

// Game 2 ID needs to be inserted like game 1 ID above for getGameScores function
const renderSpaceInvaders = (req, res) => {
  // const _id = new ObjectId("66491162c23d1fb55d9fcd15"); // Instantiate Mongoose's ObjectId
  const userId = req.user ? req.user.id : null;
  const userName = req.user ? req.user.name : null;
  res.render("spaceInvaders", {
    name: userName,
    gameId: process.env.SPACE_INVADERS_ID,
    userId: userId,
  });
};

const renderSpaceIndex = (req, res) => {
  // const _id = new ObjectId("66491162c23d1fb55d9fcd15"); // Instantiate Mongoose's ObjectId
  const userId = req.user ? req.user.id : null;
  res.render("spaceIndex", {
    gameId: process.env.SPACE_INVADERS_ID,
    userId: userId,
  });
};

module.exports = {
  renderSnakeGame,
  renderSpaceInvaders,
  renderSnakeIndex,
  renderSpaceIndex,
};
