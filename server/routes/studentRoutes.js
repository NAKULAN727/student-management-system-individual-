const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getStudentAnnouncements,
  getStudentAttendance,
  getStudentTimetable,
} = require("../controllers/studentController");

router.get(
  "/announcements",
  protect,
  authorize("Student"),
  getStudentAnnouncements
);

router.get("/attendance", protect, authorize("Student"), getStudentAttendance);
router.get("/timetable", protect, authorize("Student"), getStudentTimetable);

module.exports = router;
