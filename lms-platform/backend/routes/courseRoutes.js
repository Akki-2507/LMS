const express = require("express");
const router = express.Router();
const {
  getCourses, getCourseById, createCourse, updateCourse,
  deleteCourse, enrollCourse, getMyCourses, updateProgress,
  getAdminStats, seedCourses,
} = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCourses);
router.get("/admin/stats", protect, adminOnly, getAdminStats);
router.get("/:id", getCourseById);

router.post("/enroll", protect, enrollCourse);
router.get("/user/mycourses", protect, getMyCourses);
router.put("/:courseId/progress", protect, updateProgress);

router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

router.post("/seed/all", seedCourses);

module.exports = router;