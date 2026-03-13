const Course = require("../models/Course");
const User = require("../models/User");

// @route GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { instructor: { $regex: search, $options: "i" } },
    ];
    if (category && category !== "All") query.category = category;
    if (level && level !== "All") query.level = level;
    const courses = await Course.find(query).select("-lessons").sort({ createdAt: -1 });
    res.json(courses);
  } catch {
    res.status(500).json({ message: "Server error fetching courses" });
  }
};

// @route GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch {
    res.status(500).json({ message: "Server error fetching course" });
  }
};

// @route POST /api/courses  — Admin: Create course
const createCourse = async (req, res) => {
  try {
    const { title, description, instructor, duration, category, level, thumbnail, lessons } = req.body;
    if (!title || !description || !instructor || !duration || !category)
      return res.status(400).json({ message: "All required fields must be filled" });

    const course = await Course.create({
      title, description, instructor, duration,
      category, level: level || "Beginner",
      thumbnail: thumbnail || "",
      lessons: lessons || [],
    });
    res.status(201).json(course);
  } catch {
    res.status(500).json({ message: "Server error creating course" });
  }
};

// @route PUT /api/courses/:id  — Admin: Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const fields = ["title", "description", "instructor", "duration", "category", "level", "thumbnail", "lessons"];
    fields.forEach(f => { if (req.body[f] !== undefined) course[f] = req.body[f]; });

    const updated = await course.save();
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error updating course" });
  }
};

// @route DELETE /api/courses/:id  — Admin: Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error deleting course" });
  }
};

// @route POST /api/enroll
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const alreadyEnrolled = user.enrolledCourses.some(e => e.course.toString() === courseId);
    if (alreadyEnrolled) return res.status(400).json({ message: "Already enrolled in this course" });

    user.enrolledCourses.push({ course: courseId, progress: 0 });
    await user.save();
    course.enrolledCount += 1;
    await course.save();
    res.json({ message: "Enrolled successfully" });
  } catch {
    res.status(500).json({ message: "Server error during enrollment" });
  }
};

// @route GET /api/mycourses
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses.course");
    if (!user) return res.status(404).json({ message: "User not found" });
    const enrolledCourses = user.enrolledCourses.map(e => ({
      ...e.course.toObject(),
      progress: e.progress,
      completedLessons: e.completedLessons,
      enrolledAt: e.enrolledAt,
    }));
    res.json(enrolledCourses);
  } catch {
    res.status(500).json({ message: "Server error fetching enrolled courses" });
  }
};

// @route PUT /api/courses/:courseId/progress
const updateProgress = async (req, res) => {
  try {
    const { lessonIndex } = req.body;
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(e => e.course.toString() === courseId);
    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    if (!enrollment.completedLessons.includes(lessonIndex))
      enrollment.completedLessons.push(lessonIndex);

    const course = await Course.findById(courseId);
    enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
    await user.save();
    res.json({ progress: enrollment.progress, completedLessons: enrollment.completedLessons });
  } catch {
    res.status(500).json({ message: "Server error updating progress" });
  }
};

// @route GET /api/courses/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalEnrollments = await User.aggregate([
      { $project: { count: { $size: "$enrolledCourses" } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);
    const coursesByCategory = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json({
      totalCourses,
      totalUsers,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      coursesByCategory,
    });
  } catch {
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

// @route POST /api/courses/seed/all
const seedCourses = async (req, res) => {
  try {
    await Course.deleteMany({});
    const sampleCourses = [
      {
        title: "JavaScript for Beginners",
        description: "Master the fundamentals of JavaScript — variables, functions, DOM manipulation, ES6+ features, and asynchronous programming.",
        instructor: "Alex Carter", duration: "12 hours",
        category: "Programming Language", level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
        rating: 4.8, enrolledCount: 2340,
        lessons: [
          { title: "Introduction to JavaScript", duration: "15 min", order: 1 },
          { title: "Variables and Data Types", duration: "20 min", order: 2 },
          { title: "Functions and Scope", duration: "25 min", order: 3 },
          { title: "Arrays and Objects", duration: "30 min", order: 4 },
          { title: "DOM Manipulation", duration: "35 min", order: 5 },
          { title: "ES6+ Features", duration: "40 min", order: 6 },
          { title: "Promises and Async/Await", duration: "35 min", order: 7 },
          { title: "Final Project: Todo App", duration: "50 min", order: 8 },
        ],
      },
      {
        title: "Advanced React Development",
        description: "Deep dive into React — advanced hooks, Context API, Redux Toolkit, performance optimization, custom hooks, and production-ready apps.",
        instructor: "Sarah Johnson", duration: "16 hours",
        category: "Web Development", level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        rating: 4.9, enrolledCount: 1890,
        lessons: [
          { title: "React Architecture Review", duration: "20 min", order: 1 },
          { title: "Advanced Hooks", duration: "35 min", order: 2 },
          { title: "Custom Hooks Patterns", duration: "40 min", order: 3 },
          { title: "Redux Toolkit", duration: "45 min", order: 4 },
          { title: "Performance Optimization", duration: "35 min", order: 5 },
          { title: "Testing React Components", duration: "45 min", order: 6 },
        ],
      },
      {
        title: "Python Programming Masterclass",
        description: "From zero to Python pro — syntax, OOP, file handling, decorators, generators, and scripting real-world automation tasks.",
        instructor: "Michael Chen", duration: "20 hours",
        category: "Programming Language", level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
        rating: 4.7, enrolledCount: 3100,
        lessons: [
          { title: "Python Setup and Basics", duration: "20 min", order: 1 },
          { title: "Control Flow and Loops", duration: "25 min", order: 2 },
          { title: "Functions and Lambda", duration: "30 min", order: 3 },
          { title: "OOP in Python", duration: "50 min", order: 4 },
          { title: "File Handling", duration: "30 min", order: 5 },
          { title: "Automation Scripts Project", duration: "60 min", order: 6 },
        ],
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable REST APIs with Node.js and Express — middleware, JWT auth, MongoDB integration, and API security best practices.",
        instructor: "David Kumar", duration: "14 hours",
        category: "Backend Development", level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
        rating: 4.8, enrolledCount: 1560,
        lessons: [
          { title: "Node.js Architecture", duration: "20 min", order: 1 },
          { title: "Express Fundamentals", duration: "30 min", order: 2 },
          { title: "MongoDB with Mongoose", duration: "40 min", order: 3 },
          { title: "JWT Authentication", duration: "45 min", order: 4 },
          { title: "Deploy to Production", duration: "40 min", order: 5 },
        ],
      },
      {
        title: "Machine Learning with Python",
        description: "Practical ML from scratch — supervised learning, scikit-learn, feature engineering, model evaluation, and real-world datasets.",
        instructor: "Dr. Priya Sharma", duration: "22 hours",
        category: "Data Science", level: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
        rating: 4.8, enrolledCount: 2100,
        lessons: [
          { title: "ML Fundamentals", duration: "40 min", order: 1 },
          { title: "NumPy and Pandas", duration: "45 min", order: 2 },
          { title: "Linear Regression", duration: "50 min", order: 3 },
          { title: "Decision Trees", duration: "45 min", order: 4 },
          { title: "Model Evaluation", duration: "45 min", order: 5 },
        ],
      },
      {
        title: "Full Stack Web Development",
        description: "Build complete web apps — HTML/CSS, JavaScript, React frontend, Node.js backend, MongoDB, REST APIs, and cloud deployment.",
        instructor: "James Wilson", duration: "30 hours",
        category: "Web Development", level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
        rating: 4.7, enrolledCount: 3450,
        lessons: [
          { title: "HTML5 and CSS3", duration: "40 min", order: 1 },
          { title: "JavaScript Essentials", duration: "50 min", order: 2 },
          { title: "React Fundamentals", duration: "60 min", order: 3 },
          { title: "Node.js and Express", duration: "50 min", order: 4 },
          { title: "MongoDB Integration", duration: "45 min", order: 5 },
        ],
      },
      {
        title: "Data Structures and Algorithms",
        description: "Master DSA for coding interviews — arrays, linked lists, trees, graphs, sorting, dynamic programming, and Big-O analysis.",
        instructor: "Emily Zhang", duration: "18 hours",
        category: "Programming Language", level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
        rating: 4.9, enrolledCount: 2780,
        lessons: [
          { title: "Big-O Analysis", duration: "30 min", order: 1 },
          { title: "Arrays and Strings", duration: "40 min", order: 2 },
          { title: "Linked Lists", duration: "45 min", order: 3 },
          { title: "Trees and BST", duration: "50 min", order: 4 },
          { title: "Dynamic Programming", duration: "60 min", order: 5 },
        ],
      },
      {
        title: "MongoDB for Developers",
        description: "Master MongoDB — CRUD, aggregation pipelines, indexing, schema design, Atlas cloud setup, and Mongoose ODM deep dive.",
        instructor: "Rachel Torres", duration: "10 hours",
        category: "Backend Development", level: "Intermediate",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
        rating: 4.6, enrolledCount: 1230,
        lessons: [
          { title: "MongoDB Basics", duration: "20 min", order: 1 },
          { title: "CRUD Operations", duration: "35 min", order: 2 },
          { title: "Aggregation Pipeline", duration: "50 min", order: 3 },
          { title: "Indexing and Performance", duration: "35 min", order: 4 },
          { title: "Mongoose Deep Dive", duration: "45 min", order: 5 },
        ],
      },
    ];
    const created = await Course.insertMany(sampleCourses);
    res.json({ message: `✅ Seeded ${created.length} courses` });
  } catch {
    res.status(500).json({ message: "Server error seeding courses" });
  }
};

module.exports = {
  getCourses, getCourseById, createCourse, updateCourse,
  deleteCourse, enrollCourse, getMyCourses, updateProgress,
  getAdminStats, seedCourses,
};