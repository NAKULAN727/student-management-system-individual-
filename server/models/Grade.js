const mongoose = require("mongoose");

const gradeSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    examType: { type: String, required: true }, // Midterm, Final, Quiz
    subjects: [
      {
        name: { type: String, required: true },
        score: { type: Number, required: true },
        total: { type: Number, default: 100 },
        remarks: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;
