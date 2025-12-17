const User = require("../models/User");
const Class = require("../models/Class");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({}).populate("teacherDetails.assignedClasses");
  res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, role, classId } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const userData = {
    name,
    email,
    password,
    role,
  };

  if (role === "Student" && classId) {
    userData.studentDetails = { classId };
  }

  const user = await User.create(userData);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentDetails: user.studentDetails,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Get all classes
// @route   GET /api/admin/classes
// @access  Private/Admin
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate("subjects.subject")
      .populate("subjects.teacher");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new class
// @route   POST /api/admin/classes
// @access  Private/Admin
const createClass = async (req, res) => {
  try {
    const { name, section } = req.body;

    // Check if class with same name and section exists
    const classExists = await Class.findOne({ name, section });
    if (classExists) {
      res.status(400);
      throw new Error("Class with this name and section already exists");
    }

    const newClass = await Class.create({
      name,
      section,
    });

    if (newClass) {
      res.status(201).json(newClass);
    } else {
      res.status(400);
      throw new Error("Invalid class data");
    }
  } catch (error) {
    console.error("Create Class Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add subject and teacher to class
// @route   POST /api/admin/classes/:id/subjects
// @access  Private/Admin
const addSubjectToClass = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;
    const cls = await Class.findById(req.params.id);
    const teacher = await User.findById(teacherId);

    if (!cls || !teacher) {
      res.status(404);
      throw new Error("Class or Teacher not found");
    }

    // Check if subject already exists in class
    const subjectExists = cls.subjects.find(
      (s) => s.subject && s.subject.toString() === subjectId
    );
    if (subjectExists) {
      res.status(400);
      throw new Error("Subject already added to this class");
    }

    cls.subjects.push({ subject: subjectId, teacher: teacherId });
    await cls.save();

    // Also add class to teacher's assignedClasses if not present (Legacy support)
    if (!teacher.teacherDetails) teacher.teacherDetails = {};
    if (!teacher.teacherDetails.assignedClasses)
      teacher.teacherDetails.assignedClasses = [];

    if (!teacher.teacherDetails.assignedClasses.includes(cls._id)) {
      teacher.teacherDetails.assignedClasses.push(cls._id);
      await teacher.save();
    }

    const updatedClass = await Class.findById(cls._id)
      .populate("subjects.subject")
      .populate("subjects.teacher");
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to add subject" });
  }
};

// @desc    Assign class to teacher
// @route   POST /api/admin/assign-class
// @access  Private/Admin
const assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId, classId } = req.body;

    if (!teacherId || !classId) {
      res.status(400);
      throw new Error("Teacher ID and Class ID are required");
    }

    const teacher = await User.findById(teacherId);
    const classObj = await Class.findById(classId);

    if (!teacher || !classObj) {
      res.status(404);
      throw new Error("Teacher or Class not found");
    }

    if (teacher.role !== "Teacher") {
      res.status(400);
      throw new Error("User is not a teacher");
    }

    // Safely Initialize teacherDetails
    if (!teacher.teacherDetails) {
      teacher.teacherDetails = {};
    }

    // Safely Initialize assignedClasses array
    if (!teacher.teacherDetails.assignedClasses) {
      teacher.teacherDetails.assignedClasses = [];
    }

    // Add class if not already present
    if (!teacher.teacherDetails.assignedClasses.includes(classId)) {
      teacher.teacherDetails.assignedClasses.push(classId);
      await teacher.save();
    }

    res.json({ message: "Class assigned successfully", teacher });
  } catch (error) {
    console.error("Assign Class Error:", error.message);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: error.message || "Failed to assign class",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  }
};

const Subject = require("../models/Subject");
const Announcement = require("../models/Announcement");

// ... existing code ...

// @desc    Update a class
// @route   PUT /api/admin/classes/:id
// @access  Private/Admin
const updateClass = async (req, res) => {
  try {
    const { name, section, subjects } = req.body;
    const cls = await Class.findById(req.params.id);

    if (cls) {
      cls.name = name || cls.name;
      cls.section = section || cls.section;
      cls.subjects = subjects || cls.subjects;

      const updatedClass = await cls.save();
      res.json(updatedClass);
    } else {
      res.status(404);
      throw new Error("Class not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a class
// @route   DELETE /api/admin/classes/:id
// @access  Private/Admin
const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (cls) {
      await cls.deleteOne();
      res.json({ message: "Class removed" });
    } else {
      res.status(404);
      throw new Error("Class not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subjects
// @route   GET /api/admin/subjects
// @access  Private/Admin
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a subject
// @route   POST /api/admin/subjects
// @access  Private/Admin
const createSubject = async (req, res) => {
  try {
    const { name, code, department } = req.body;
    const subject = new Subject({ name, code, department });
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/admin/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      await subject.deleteOne();
      res.json({ message: "Subject removed" });
    } else {
      res.status(404).json({ message: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all announcements
// @route   GET /api/admin/announcements
// @access  Private/Admin
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).populate(
      "postedBy",
      "name"
    );
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, audience } = req.body;
    const announcement = new Announcement({
      title,
      content,
      audience,
      postedBy: req.user._id,
    });
    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (announcement) {
      await announcement.deleteOne();
      res.json({ message: "Announcement removed" });
    } else {
      res.status(404).json({ message: "Announcement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
