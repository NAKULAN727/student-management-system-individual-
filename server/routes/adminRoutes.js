const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getUsers,
  deleteUser,
  createUser,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  assignClassToTeacher,
  getSubjects,
  createSubject,
  deleteSubject,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  addSubjectToClass,
  getPasswordResetRequests,
  resolvePasswordResetRequest,
} = require("../controllers/adminController");

router
  .route("/users")
  .get(protect, authorize("Admin"), getUsers)
  .post(protect, authorize("Admin"), createUser);

router.route("/users/:id").delete(protect, authorize("Admin"), deleteUser);

router
  .route("/classes")
  .get(protect, authorize("Admin"), getClasses)
  .post(protect, authorize("Admin"), createClass);

router
  .route("/classes/:id")
  .put(protect, authorize("Admin"), updateClass)
  .delete(protect, authorize("Admin"), deleteClass);

router.post(
  "/classes/:id/subjects",
  protect,
  authorize("Admin"),
  addSubjectToClass
);

router
  .route("/assign-class")
  .post(protect, authorize("Admin"), assignClassToTeacher);

router
  .route("/subjects")
  .get(protect, authorize("Admin"), getSubjects)
  .post(protect, authorize("Admin"), createSubject);

router
  .route("/subjects/:id")
  .delete(protect, authorize("Admin"), deleteSubject);

router
  .route("/announcements")
  .get(protect, authorize("Admin"), getAnnouncements)
  .post(protect, authorize("Admin"), createAnnouncement);

router
  .route("/announcements/:id")
  .delete(protect, authorize("Admin"), deleteAnnouncement);

router
  .route("/requests")
  .get(protect, authorize("Admin"), getPasswordResetRequests);

router
  .route("/requests/:id/resolve")
  .put(protect, authorize("Admin"), resolvePasswordResetRequest);

module.exports = router;
