const express = require("express");
const router = express.Router();
const indexController = require("../Controllers/indexController");
const { ensureAuthenticated } = require("../config/auth");

// Landing page
router.get("/", indexController.renderIndex);

// Dashboard (The page accessed post-login)
router.get("/index", ensureAuthenticated, indexController.renderDashboard);

module.exports = router;
