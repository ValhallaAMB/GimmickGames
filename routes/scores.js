const express = require("express");
const router = express.Router();
const scoreController = require("../Controllers/scoreController");
const { ensureAuthenticated } = require("../config/auth");

// Get leaderboard for a specific game
router.get("/leaderboard/:gameName", scoreController.getLeaderboard);

// Save user score       // Needs to have ensureAuthenticated once ejs page is available
router.post("/save", ensureAuthenticated, scoreController.saveScore);

module.exports = router;
