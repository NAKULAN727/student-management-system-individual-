const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUserProfile,
  forgotPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.get("/profile", protect, getUserProfile);

module.exports = router;
