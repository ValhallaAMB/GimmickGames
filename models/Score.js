const { Long } = require("mongodb");
const mongoose = require("mongoose");

// Import the Game model
const Game = require("./Game");

// Import the User model
const User = require("./User");

// Define the schema for the Score model
const scoreSchema = mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Score model
const Score = mongoose.model("Score", scoreSchema);
module.exports = Score;
