const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "lms_secret_key_2024";
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio, token: generateToken(user._id) });
  } catch { res.status(500).json({ message: "Server error during signup" }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio, token: generateToken(user._id) });
  } catch { res.status(500).json({ message: "Server error during login" }); }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch { res.status(500).json({ message: "Server error" }); }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { name, bio, password } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      user.password = password;
    }
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, bio: updated.bio, token: generateToken(updated._id) });
  } catch { res.status(500).json({ message: "Server error updating profile" }); }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch { res.status(500).json({ message: "Server error" }); }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = user.role === "admin" ? "student" : "admin";
    await user.save();
    res.json({ message: `User is now ${user.role}`, role: user.role });
  } catch { res.status(500).json({ message: "Server error" }); }
};

module.exports = { signup, login, getProfile, updateProfile, getAllUsers, makeAdmin };