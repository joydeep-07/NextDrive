const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/User.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PROTECTED ROUTE – GET ALL USERS
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
