const mongoose = require("mongoose");
const User = require("./models/User");
const Class = require("./models/Class");
const Timetable = require("./models/Timetable");
const dotenv = require("dotenv");

dotenv.config();

const debugStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Find Sudhir
    // Note: The screenshot shows "Welcome Back, Sudhir!" so name might be "Sudhir" or similar.
    // I'll search by regex to be safe.
    const student = await User.findOne({
      name: { $regex: "Sudhir", $options: "i" },
      role: "Student",
    }).populate("studentDetails.classId");

    if (!student) {
      console.log("User 'Sudhir' not found.");
    } else {
      console.log("Found Student:", student.name);
      console.log("Student ID:", student._id);
      console.log("Role:", student.role);
      console.log("Class Details:", student.studentDetails?.classId);
    }

    // 2. Find Class 11 A
    const class11A = await Class.findOne({ name: "11", section: "A" });
    if (class11A) {
      console.log("Class 11 A ID:", class11A._id);

      // Check if Timetable exists for this class
      const timetable = await Timetable.findOne({ classId: class11A._id });
      console.log("Timetable for 11 A exists?", !!timetable);
      if (timetable) {
        console.log("Timetable ID:", timetable._id);
      }
    } else {
      console.log("Class 11 A not found.");
    }

    // 3. Fix if needed
    if (student && class11A) {
      if (
        !student.studentDetails?.classId ||
        student.studentDetails.classId._id.toString() !==
          class11A._id.toString()
      ) {
        console.log("Updating Sudhir to Class 11 A...");
        student.studentDetails.classId = class11A._id;
        await student.save();
        console.log("Updated Sudhir's class.");
      } else {
        console.log("Sudhir is already in Class 11 A.");
      }
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

debugStudent();
