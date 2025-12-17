const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes (to be imported)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
// app.use('/api/users', require('./routes/userRoutes'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Server ready
