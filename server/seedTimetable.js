const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Class = require("./models/Class");
const Timetable = require("./models/Timetable");
// We might need to import Subject if we were linking IDs, but we are using strings for now based on the model I created

dotenv.config();

const seedTimetable = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // 1. Find or Create Class 10-A
    let grade10A = await Class.findOne({ name: "Grade 10", section: "A" });

    if (!grade10A) {
      grade10A = await Class.create({
        name: "Grade 10",
        section: "A",
      });
      console.log("Created Class: Grade 10 - A");
    } else {
      console.log("Found Class: Grade 10 - A");
    }

    // 2. Define Subjects and Schedule
    // 8 Periods per day
    // Timings:
    // 1: 09:00-09:45
    // 2: 09:45-10:30
    // 3: 10:45-11:30
    // 4: 11:30-12:15
    // Lunch: 12:15-13:00
    // 5: 13:00-13:45
    // 6: 13:45-14:30
    // 7: 14:45-15:30
    // 8: 15:30-16:15

    const times = [
      { start: "09:00", end: "09:45" },
      { start: "09:45", end: "10:30" },
      { start: "10:45", end: "11:30" },
      { start: "11:30", end: "12:15" },
      { start: "13:00", end: "13:45" },
      { start: "13:45", end: "14:30" },
      { start: "14:45", end: "15:30" },
      { start: "15:30", end: "16:15" },
    ];

    // Subjects: Maths(8), Science(8), English(8), Social(7), Tamil(7), PT(2) = 40
    // Total slots: 5 days * 8 periods = 40

    const weekSchedule = {
      Monday: [
        "Maths",
        "Science",
        "English",
        "Social",
        "Tamil",
        "Maths",
        "Science",
        "English",
      ],
      Tuesday: [
        "Social",
        "Tamil",
        "Maths",
        "Science",
        "English",
        "Social",
        "PT",
        "Tamil",
      ],
      Wednesday: [
        "Maths",
        "Science",
        "English",
        "Social",
        "Tamil",
        "Maths",
        "Science",
        "English",
      ],
      Thursday: [
        "Social",
        "Tamil",
        "Maths",
        "Science",
        "English",
        "Social",
        "Tamil",
        "PT",
      ],
      Friday: [
        "Maths",
        "Science",
        "English",
        "Social",
        "Tamil",
        "Maths",
        "Science",
        "English",
      ],
    };

    const formattedSchedule = {};

    for (const [day, subjects] of Object.entries(weekSchedule)) {
      formattedSchedule[day] = subjects.map((sub, index) => ({
        period: index + 1,
        subject: sub,
        startTime: times[index].start,
        endTime: times[index].end,
      }));
    }

    // 3. Create/Update Timetable
    let timetable = await Timetable.findOne({ classId: grade10A._id });

    if (timetable) {
      timetable.schedule = formattedSchedule;
      await timetable.save();
      console.log("Updated Timetable for Grade 10 - A");
    } else {
      await Timetable.create({
        classId: grade10A._id,
        schedule: formattedSchedule,
      });
      console.log("Created Timetable for Grade 10 - A");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding timetable:", error);
    process.exit(1);
  }
};

seedTimetable();
