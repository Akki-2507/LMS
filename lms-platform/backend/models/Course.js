const mongoose = require("mongoose");

/**
 * Lesson subdocument schema
 * Each course contains multiple lessons
 */
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: "10 min" },
  videoUrl: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

/**
 * Course Model
 * Represents a programming/tech course in the LMS
 */
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Programming Language",
        "Web Development",
        "Backend Development",
        "Data Science",
      ],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: { type: String, default: "" },
    lessons: [lessonSchema],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
