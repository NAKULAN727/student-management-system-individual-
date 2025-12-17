const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
  {
    date: { type: Date, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    records: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["Present", "Absent", "Late"],
          default: "Present",
        },
        remarks: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
