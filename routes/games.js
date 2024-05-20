const express = require("express");
const router = express.Router();
const gameController = require("../Controllers/gameController");

// Get Game Snake Page
router.get("/snakeIndex", gameController.renderSnakeIndex);

// Get Game Space Invaders Page
router.get("/spaceIndex", gameController.renderSpaceIndex);

// Get Snake Gameplay Page
router.get("/snakeGame", gameController.renderSnakeGame);

// Get Space Invaders Gameplay Page
router.get("/spaceInvaders", gameController.renderSpaceInvaders);

module.exports = router;
