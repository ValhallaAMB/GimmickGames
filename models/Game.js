const { Long } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const game = mongoose.model("Game", gameSchema);
module.exports = game;
