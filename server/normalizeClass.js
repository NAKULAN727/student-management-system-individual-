const mongoose = require("mongoose");
const Class = require("./models/Class");
const dotenv = require("dotenv");

dotenv.config();

const normalizeClassName = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Find the class "11" - "A"
    const cls = await Class.findOne({ name: "11", section: "A" });

    if (cls) {
      console.log(`Found Class '11' 'A'. Renaming to 'Class 11' 'A'...`);
      cls.name = "Class 11"; // Standardize name
      await cls.save();
      console.log("Renamed successfully.");
    } else {
      console.log("No class named '11' found. Checking for 'Class 11'...");
      const cls2 = await Class.findOne({ name: "Class 11", section: "A" });
      if (cls2) {
        console.log("Class is already named 'Class 11'.");
      } else {
        console.log("Neither '11' nor 'Class 11' found.");
      }
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

normalizeClassName();
