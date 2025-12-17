const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getStudentsByClass,
  markAttendance,
  uploadMarks,
  getMarksByClass,
  createAnnouncement,
} = require("../controllers/teacherController");

router
  .route("/classes/:classId/students")
  .get(protect, authorize("Teacher", "Admin"), getStudentsByClass);

router.get(
  "/classes/:classId/marks",
  protect,
  authorize("Teacher", "Admin"),
  getMarksByClass
);

router.post("/attendance", protect, authorize("Teacher"), markAttendance);
router.post("/marks", protect, authorize("Teacher"), uploadMarks);
router.post(
  "/announcements",
  protect,
  authorize("Teacher"),
  createAnnouncement
);

module.exports = router;
