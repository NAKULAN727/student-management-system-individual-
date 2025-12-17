const mongoose = require("mongoose");

const announcementSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: [
      {
        type: String,
        enum: ["All", "Student", "Teacher", "Parent"],
        default: "All",
      },
    ],
    targetClass: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
