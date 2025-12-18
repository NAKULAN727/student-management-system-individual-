const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Parent", "Teacher", "Admin"],
      default: "Student",
    },
    // Additional fields for specific roles
    studentDetails: {
      classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rollNumber: { type: String },
      admissionNumber: { type: String, unique: true, sparse: true },
    },
    parentDetails: {
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    teacherDetails: {
      subjects: [{ type: String }],
      assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
