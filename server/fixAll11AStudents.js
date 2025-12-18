const mongoose = require("mongoose");
const User = require("./models/User");
const Class = require("./models/Class");
const dotenv = require("dotenv");

dotenv.config();

const fixStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Get the target Class 11 A
    const class11A = await Class.findOne({ name: "11", section: "A" });
    if (!class11A) {
      console.error("Class 11 A not found! Run the seed script first.");
      process.exit(1);
    }
    console.log(`Target Class 11 A ID: ${class11A._id}`);

    // 2. Identify students to update
    // User mentioned "Nakulan" and "Perumal" explicitly.
    // I will also search for any student who might have a text string "11 A" but not the link, just in case (though schema uses ObjectId).
    // Primarily I will target the names provided.
    const targetNames = ["Nakulan", "Perumal"];

    for (const name of targetNames) {
      const student = await User.findOne({
        name: { $regex: new RegExp(name, "i") },
        role: "Student",
      });

      if (student) {
        console.log(`Found student: ${student.name} (ID: ${student._id})`);

        // Check current class
        const currentClassId = student.studentDetails?.classId;
        console.log(`Current Class ID: ${currentClassId}`);

        if (
          !currentClassId ||
          currentClassId.toString() !== class11A._id.toString()
        ) {
          // Update
          if (!student.studentDetails) student.studentDetails = {};
          student.studentDetails.classId = class11A._id;
          await student.save();
          console.log(`✅ Updated ${student.name} to Class 11 A`);
        } else {
          console.log(
            `ℹ️ ${student.name} is already correctly assigned to Class 11 A`
          );
        }
      } else {
        console.log(`⚠️ Student '${name}' not found in database.`);
      }
    }

    console.log("Done upgrading students.");
    process.exit();
  } catch (error) {
    console.error("Error fixing students:", error);
    process.exit(1);
  }
};

fixStudents();
