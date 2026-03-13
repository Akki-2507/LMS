const express = require("express");
const router = express.Router();
const { signup, login, getProfile, updateProfile, getAllUsers, makeAdmin } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/make-admin", protect, adminOnly, makeAdmin);

// One-time helper to make first admin — remove after use
router.post("/make-first-admin", async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = "admin";
    await user.save();
    res.json({ message: `✅ ${user.name} is now an admin!` });
  } catch { res.status(500).json({ message: "Error" }); }
});

module.exports = router;