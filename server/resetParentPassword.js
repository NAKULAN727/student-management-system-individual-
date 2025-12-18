const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const resetPass = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const email = "saravanan@eluria.edu";
    const user = await User.findOne({ email });

    if (user) {
      user.password = "123456"; // Schema pre-save hook should hash this
      await user.save();
      console.log(`Password for ${email} reset to 123456`);
    } else {
      console.log("User not found");
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetPass();
