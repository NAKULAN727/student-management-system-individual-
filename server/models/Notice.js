const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetAudience: [
      { type: String, enum: ["Student", "Parent", "Teacher", "All"] },
    ],
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
