const mongoose = require("mongoose");
const Class = require("./models/Class");
const User = require("./models/User");
const Timetable = require("./models/Timetable");
const dotenv = require("dotenv");

dotenv.config();

const auditClasses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Find all classes that might resemble 11 A
    // We look for name containing "11"
    const classes = await Class.find({
      $or: [{ name: /11/ }, { name: /Class 11/ }],
    });

    console.log("Found Classes:", JSON.stringify(classes, null, 2));

    // 2. See how many students are in each
    for (const cls of classes) {
      const studentCount = await User.countDocuments({
        "studentDetails.classId": cls._id,
      });
      console.log(
        `Class ID ${cls._id} (${cls.name} - ${cls.section}): ${studentCount} students`
      );

      const timetable = await Timetable.findOne({ classId: cls._id });
      console.log(`  -> Has Timetable? ${!!timetable}`);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

auditClasses();
