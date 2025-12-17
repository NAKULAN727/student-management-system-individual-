const User = require("../models/User");
const Attendance = require("../models/Attendance");

const Grade = require("../models/Grade");
const Announcement = require("../models/Announcement");

// @desc    Get students for a specific class
// @route   GET /api/teacher/classes/:classId/students
// @access  Private/Teacher
const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Find all users with role "Student" and the matching classId
    const students = await User.find({
      role: "Student",
      "studentDetails.classId": classId,
    }).select("-password"); // Exclude password

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance for a class
// @route   POST /api/teacher/attendance
// @access  Private/Teacher
const markAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceData } = req.body;

    // Check if attendance already exists for this date and class
    let attendance = await Attendance.findOne({ classId, date });

    if (attendance) {
      // Update existing records
      attendance.records = attendanceData;
      await attendance.save();
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        classId,
        date,
        records: attendanceData,
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload marks for a class
// @route   POST /api/teacher/marks
// @access  Private/Teacher
const uploadMarks = async (req, res) => {
  try {
    const { classId, subjectName, examType, marksData, totalMaxMarks } =
      req.body;
    const total = totalMaxMarks || 100;

    console.log("Upload Marks Request:", {
      classId,
      subjectName,
      examType,
      total,
      marksCount: marksData?.length,
    });

    // marksData = [{ studentId, score }]

    for (const entry of marksData) {
      const { studentId, score } = entry;
      console.log(`Processing mark for student: ${studentId}, Score: ${score}`);

      // Find grade record for student + class + examType
      let grade = await Grade.findOne({ studentId, classId, examType });

      if (!grade) {
        console.log("Creating new Grade record");
        grade = new Grade({
          studentId,
          classId,
          examType,
          subjects: [],
        });
      }

      // Check if subject already exists
      const subjectIndex = grade.subjects.findIndex(
        (s) => s.name === subjectName
      );

      if (subjectIndex > -1) {
        console.log("Updating existing subject score");
        grade.subjects[subjectIndex].score = score;
        grade.subjects[subjectIndex].total = total;
      } else {
        console.log("Adding new subject score");
        grade.subjects.push({ name: subjectName, score, total });
      }

      await grade.save();
    }

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("Error uploading marks:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get marks for a specific class
// @route   GET /api/teacher/classes/:classId/marks
// @access  Private/Teacher
const getMarksByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { examType } = req.query;

    const query = { classId };
    if (examType) {
      query.examType = examType;
    }

    const grades = await Grade.find(query);
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement (Teacher)
// @route   POST /api/teacher/announcements
// @access  Private/Teacher
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, audience, classId } = req.body;

    console.log("Creating/Posting Announcement:", {
      title,
      audience,
      classId,
      user: req.user._id,
    });

    const announcement = new Announcement({
      title,
      content,
      audience: audience || ["Student", "Parent"], // Default to relevant audience
      targetClass: classId || undefined, // undefined works better than null for skipping references
      postedBy: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStudentsByClass,
  markAttendance,
  uploadMarks,
  getMarksByClass,
  createAnnouncement,
};
