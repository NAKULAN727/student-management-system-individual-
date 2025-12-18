const User = require("../models/User");
const PasswordResetRequest = require("../models/PasswordResetRequest");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .populate("parentDetails.linkedStudentId")
    .populate("parentDetails.children");

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      parentDetails: user.parentDetails, // Return populated details
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on requirement)
const registerUser = async (req, res) => {
  const { name, email, password, role, linkedStudentAdmissionNumber } =
    req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    let userDetails = {};
    let admissionNum = undefined;

    // Handle Student Registration
    if (role === "Student") {
      // Generate Admission Number (ELU-STU-<Random 4 digits>)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      admissionNum = `ELU-STU-${randomNum}`;
      userDetails = {
        studentDetails: {
          admissionNumber: admissionNum,
        },
      };
    }

    // Handle Parent Registration
    let childrenIds = [];
    if (role === "Parent") {
      if (!linkedStudentAdmissionNumber) {
        res.status(400);
        throw new Error(
          "Student Admission Number is required for Parent registration"
        );
      }

      // Check if student exists
      const student = await User.findOne({
        "studentDetails.admissionNumber": linkedStudentAdmissionNumber,
        role: "Student",
      });

      if (!student) {
        res.status(404);
        throw new Error("Invalid Admission Number");
      }

      childrenIds.push(student._id);
      userDetails = {
        parentDetails: {
          children: childrenIds,
          linkedStudentId: student._id,
        },
      };
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      ...userDetails,
    });

    // If Parent, also update the Student with parentId
    if (role === "Parent" && childrenIds.length > 0) {
      await User.findByIdAndUpdate(childrenIds[0], {
        $set: { "studentDetails.parentId": user._id },
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        admissionNumber:
          role === "Student" ? user.studentDetails.admissionNumber : undefined,
        children: role === "Parent" ? childrenIds : undefined,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(res.statusCode || 500); // Preserve 404/400 codes
    throw new Error(error.message);
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "teacherDetails.assignedClasses",
      populate: {
        path: "subjects.subject",
      },
    })
    .populate("parentDetails.linkedStudentId")
    .populate("parentDetails.children");

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teacherDetails: user.teacherDetails,
      parentDetails: user.parentDetails,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Request Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User with this email not found");
    }

    // Check if pending request exists
    const existingRequest = await PasswordResetRequest.findOne({
      user: user._id,
      status: "Pending",
    });

    if (existingRequest) {
      res.status(400);
      throw new Error("A reset request is already pending.");
    }

    await PasswordResetRequest.create({
      user: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({ message: "Password reset request sent to Admin." });
  } catch (error) {
    res.status(res.statusCode || 500);
    throw new Error(error.message);
  }
};

module.exports = { loginUser, registerUser, getUserProfile, forgotPassword };
