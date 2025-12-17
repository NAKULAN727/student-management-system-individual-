const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getTimetable,
  saveTimetable,
} = require("../controllers/timetableController");

router.get("/:classId", protect, getTimetable);
router.post("/", protect, authorize("Admin"), saveTimetable);

module.exports = router;
