const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Class = require("./models/Class");
const Timetable = require("./models/Timetable");

dotenv.config();

const fixStudentClass = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // 1. Get the Class
    const targetClass = await Class.findOne({ name: "Grade 10", section: "A" });
    if (!targetClass) {
      console.log("Class Grade 10-A not found!");
      process.exit(1);
    }
    console.log("Target Class ID:", targetClass._id.toString());

    // 2. check Timetable
    const timetable = await Timetable.findOne({ classId: targetClass._id });
    if (!timetable) {
      console.log("Timetable for Grade 10-A not found! Running seed...");
      // You could import/run seed logic here, but for now just warn
    } else {
      console.log("Timetable found for Grade 10-A.");
    }

    // 3. Update Student Sudhir
    const studentName = "Sudhir";
    const student = await User.findOne({ name: studentName });

    if (student) {
      console.log(`Found student: ${student.name}`);
      console.log(`Current Class ID: ${student.studentDetails?.classId}`);

      student.studentDetails = {
        ...student.studentDetails,
        classId: targetClass._id,
      };

      await student.save();
      console.log(
        `Updated ${studentName} to be in Grade 10 - A (${targetClass._id})`
      );
    } else {
      console.log(`Student ${studentName} not found.`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixStudentClass();
