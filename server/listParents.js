const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const listParents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const parents = await User.find({ role: "Parent" });
    console.log("Found", parents.length, "parents.");
    parents.forEach((p) => {
      console.log(`Email: ${p.email}, Name: ${p.name}`);
    });

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listParents();
