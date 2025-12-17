const Timetable = require("../models/Timetable");
const Class = require("../models/Class");

// @desc    Get timetable for a class
// @route   GET /api/timetable/:classId
// @access  Private (Admin, Teacher, Student, Parent)
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ classId: req.params.classId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or Update timetable
// @route   POST /api/timetable
// @access  Private (Admin)
const saveTimetable = async (req, res) => {
  try {
    const { classId, schedule } = req.body;

    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    let timetable = await Timetable.findOne({ classId });

    if (timetable) {
      timetable.schedule = schedule;
      await timetable.save();
    } else {
      timetable = await Timetable.create({
        classId,
        schedule,
      });
    }

    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTimetable, saveTimetable };
