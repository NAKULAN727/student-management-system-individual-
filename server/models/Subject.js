const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Mathematics"
    code: { type: String, required: true }, // e.g., "MATH101"
    department: { type: String }, // e.g., "Science"
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
