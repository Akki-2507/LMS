const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));

// Enroll and MyCourses convenience aliases
app.post("/api/enroll", require("./middleware/authMiddleware").protect, async (req, res) => {
  const { enrollCourse } = require("./controllers/courseController");
  return enrollCourse(req, res);
});

app.get("/api/mycourses", require("./middleware/authMiddleware").protect, async (req, res) => {
  const { getMyCourses } = require("./controllers/courseController");
  return getMyCourses(req, res);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🚀 LMS API is running", status: "OK" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const BASE_PORT = parseInt(process.env.PORT, 10) || 5002;
let port = BASE_PORT;
const maxAttempts = 5;
let attempts = 0;

const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      if (attempts < maxAttempts) {
        attempts += 1;
        console.warn(` Port ${port} in use, trying ${port + 1}...`);
        port += 1;
        startServer();
      } else {
        console.error(` Could not start server after ${maxAttempts} attempts. Port ${BASE_PORT}-${port} are busy.`);
        process.exit(1);
      }
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

startServer();
