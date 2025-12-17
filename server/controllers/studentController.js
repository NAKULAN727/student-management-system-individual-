const Announcement = require("../models/Announcement");
const Attendance = require("../models/Attendance");
const Timetable = require("../models/Timetable");

// @desc    Get announcements for a student
// @route   GET /api/student/announcements
// @access  Private/Student
const getStudentAnnouncements = async (req, res) => {
  try {
    const studentClassId = req.user.studentDetails?.classId;

    const announcements = await Announcement.find({
      audience: "Student",
      $or: [
        { targetClass: null },
        { targetClass: { $exists: false } },
        { targetClass: studentClassId },
      ],
    })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance history for a student
// @route   GET /api/student/attendance
// @access  Private/Student
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Find all attendance documents where there is a record for this student
    const attendanceRecords = await Attendance.find({
      "records.studentId": studentId,
    }).sort({ date: -1 });

    const formattedAttendance = attendanceRecords.map((record) => {
      const studentRecord = record.records.find(
        (r) => r.studentId.toString() === studentId.toString()
      );
      return {
        _id: record._id,
        date: record.date,
        status: studentRecord?.status || "Unknown",
        remarks: studentRecord?.remarks || "",
      };
    });

    res.json(formattedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get timetable for a student's class
// @route   GET /api/student/timetable
// @access  Private/Student
const getStudentTimetable = async (req, res) => {
  try {
    const classId = req.user.studentDetails?.classId;
    if (!classId) {
      return res
        .status(400)
        .json({ message: "Student not assigned to a class" });
    }

    const timetable = await Timetable.findOne({ classId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentAnnouncements,
  getStudentAttendance,
  getStudentTimetable,
};
