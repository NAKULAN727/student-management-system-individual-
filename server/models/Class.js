const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Grade 10"
    section: { type: String, required: true }, // e.g., "A"
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Class Teacher (optional main teacher)
    subjects: [
      {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
