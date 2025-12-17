const mongoose = require("mongoose");

const timetableSchema = mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true,
    },
    schedule: {
      Monday: [
        {
          period: Number,
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
      Tuesday: [
        {
          period: Number,
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
      Wednesday: [
        {
          period: Number,
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
      Thursday: [
        {
          period: Number,
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
      Friday: [
        {
          period: Number,
          subject: String,
          startTime: String,
          endTime: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
