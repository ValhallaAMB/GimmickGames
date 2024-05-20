const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { ensureAuthenticated } = require("../config/auth");

// Get user profile
router.get("/profile", ensureAuthenticated, userController.getUserProfile);

// Registration Submit Control
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Logout
router.get("/logout", ensureAuthenticated, userController.logoutUser);

// Delete
router.post("/delete", ensureAuthenticated, userController.deleteUser);

// Update
router.post("/update", ensureAuthenticated, userController.updateUser);

// Forgot Password
router.post("/forgotPassword", userController.forgotPassword);

// Reset Password
router.post("/resetPassword", userController.resetPassword);

// Change Password
router.post("/changePassword", userController.changePassword);

module.exports = router;
