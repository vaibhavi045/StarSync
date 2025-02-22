const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Utility function to send error response
const sendErrorResponse = (res, message, status = 400) => res.status(status).json({ error: message });

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return sendErrorResponse(res, "All fields are required");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendErrorResponse(res, "Invalid email format");
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            return sendErrorResponse(res, "Password must be at least 6 characters long");
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return sendErrorResponse(res, "User already exists");
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("❌ Register Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return sendErrorResponse(res, "All fields are required");
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, "Invalid credentials");
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, "Invalid credentials");
        }

        // Generate JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("❌ Login Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

// @route   GET /api/auth/user
// @desc    Get user data (protected route)
// @access  Private
router.get("/user", authMiddleware.authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // Exclude password field
        if (!user) {
            return sendErrorResponse(res, "User not found", 404);
        }
        res.json(user);
    } catch (error) {
        console.error("❌ User Fetch Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

module.exports = router;
