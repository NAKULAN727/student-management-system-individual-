const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Class = require("./models/Class");
const Timetable = require("./models/Timetable");

// Load env vars
dotenv.config();

const seed = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // 1. Find or Create Class 11 A
    let class11A = await Class.findOne({
      name: { $in: ["11", "Class 11"] },
      section: "A",
    });
    if (!class11A) {
      class11A = await Class.create({
        name: "Class 11",
        section: "A",
        subjects: [],
      });
      console.log("Created Class 11 A");
    } else {
      console.log("Found Class 11 A with ID:", class11A._id);
      if (class11A.name === "11") {
        class11A.name = "Class 11";
        await class11A.save();
        console.log("Standardized name to 'Class 11'");
      }
    }

    // 2. Create Schedule
    // Subjects: Maths, Physics, Chemistry, Computer, Tamil, English, PT (1x)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const standardSubjects = [
      "Maths",
      "Physics",
      "Chemistry",
      "Computer",
      "Tamil",
      "English",
    ];
    const periodsPerDay = 6;
    const schedule = {};

    days.forEach((day, dayIndex) => {
      const daySchedule = [];
      for (let p = 1; p <= periodsPerDay; p++) {
        let subject;
        let startTime = `${8 + p}:00 AM`;
        let endTime = `${9 + p}:00 AM`;

        // Logic for PT: Friday last period
        if (day === "Friday" && p === periodsPerDay) {
          subject = "PT";
        } else {
          // Rotate subjects
          // (dayIndex + p) ensures variation across days
          const subjectIndex = (dayIndex + p) % standardSubjects.length;
          subject = standardSubjects[subjectIndex];
        }

        daySchedule.push({
          period: p,
          subject: subject,
          startTime: startTime,
          endTime: endTime,
        });
      }
      schedule[day] = daySchedule;
    });

    // 3. Save Timetable
    let timetable = await Timetable.findOne({ classId: class11A._id });
    if (timetable) {
      timetable.schedule = schedule;
      await timetable.save();
      console.log("Updated Timetable structure for 11 A");
    } else {
      await Timetable.create({
        classId: class11A._id,
        schedule: schedule,
      });
      console.log("Created new Timetable for 11 A");
    }

    console.log("Done. Timetable reflects 6 subjects + PT 1x/week.");
    process.exit();
  } catch (error) {
    console.error("Error creating timetable:", error);
    process.exit(1);
  }
};

seed();
