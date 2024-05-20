const game = require("../models/Game");
const Score = require("../models/Score");
const { findById } = require("../models/User");

//  SAVE USER SCORE (ONLY LOGGED IN USERS WITH ACTIVE SESSION, USE ENSURE AUTHENTICATED)
const saveScore = async (req, res) => {
  try {
    userId = req.user.id;
    // const snakeGameId = new ObjectId("6643ddd833742f0641edf21a");

    // Assuming you pass these values from the game page
    const { gameId, scoreValue } = req.body;
    // Find all score documents with the userId and populate the game field
    const userScores = await Score.find({ user: userId }).populate(
      "game",
      "name"
    );
    // Filter the scores array for the specific game
    const gameScores = userScores.filter((score) => score.game.id === gameId);

    // If the length is equal to 10 and scoreValue is greater than any element
    if (
      gameScores.length === 10 &&
      gameScores.some((score) => scoreValue > score.score)
    ) {
      // Find the index of the smallest score
      const minScoreIndex = gameScores.reduce(
        (minIndex, currentScore, currentIndex) => {
          return currentScore.score < gameScores[minIndex].score
            ? currentIndex
            : minIndex;
        },
        0
      );

      // Remove the smallest score from the scores list and the database
      const removedScore = gameScores.splice(minScoreIndex, 1);
      await Score.findByIdAndDelete(removedScore[0]._id);
    }

    // Create a new score document
    const newScore = new Score({
      user: userId,
      game: gameId,
      score: scoreValue,
    });

    await newScore.save(); // Save the score to the database

    if (gameId == process.env.SNAKE_GAME_ID) {
      res.render("snakeGame", { gameId });
    } else {
      res.render("spaceInvaders", { gameId });
    }
  } catch (err) {
    console.error("Error saving score:", err);
    res.send("Error saving score");
  }
};

//  GET GAME SCORES (SORT IN DESCENDING, LEADERBOARD STYLE)
const getLeaderboard = async (req, res) => {
  try {
    const { gameName } = req.params; 
    
    if (gameName == "snakeGame") {
      // Find all score documents with the same game ID and populate the 'user' field
      const gameScores = await Score.find({ game: process.env.SNAKE_GAME_ID })
        .populate("user", "name")
        .sort({ score: -1 })
        .limit(50);

      // Render the scores.ejs file and pass the gameScores array as a variable
      res.render("snakeIndex", { gameScores });
    } else {
      // Find all score documents with the same game ID and populate the 'user' field
      const gameScores = await Score.find({ game: process.env.SPACE_INVADERS_ID })
        .populate("user", "name")
        .sort({ score: -1 })
        .limit(50);

      // Render the scores.ejs file and pass the gameScores array as a variable
      res.render("spaceIndex", { gameScores });
    }
  } catch (err) {
    console.error("Error fetching game scores:", err);
    res.status(500).send("Error fetching game scores");
  }
};

module.exports = {
  saveScore,
  getLeaderboard,
};
