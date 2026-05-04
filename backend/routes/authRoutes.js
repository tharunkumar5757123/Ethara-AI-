const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// =====================
// AUTH ROUTES
// =====================

// Register user (Admin or Member based on backend rules)
router.post("/signup", signup);

// Login user
router.post("/login", login);

module.exports = router;