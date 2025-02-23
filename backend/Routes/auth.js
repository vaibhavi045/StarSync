const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/User");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Utility function to send error response
const sendErrorResponse = (res, message, status = 400) => res.status(status).json({ error: message });

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return sendErrorResponse(res, "All fields are required");

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return sendErrorResponse(res, "Invalid email format");

        // Password validation (minimum 6 characters)
        if (password.length < 6) return sendErrorResponse(res, "Password must be at least 6 characters long");

        let user = await User.findOne({ email });
        if (user) return sendErrorResponse(res, "User already exists");

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return sendErrorResponse(res, "All fields are required");

        const user = await User.findOne({ email });
        if (!user) return sendErrorResponse(res, "Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendErrorResponse(res, "Invalid credentials");

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
        const user = await User.findById(req.userId).select("-password");
        if (!user) return sendErrorResponse(res, "User not found", 404);
        res.json(user);
    } catch (error) {
        console.error("❌ User Fetch Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

// ==========================
// 🔹 Forgot Password Route
// ==========================
// @route   POST /api/auth/forgot-password
// @desc    Sends a reset link to the user's email
// @access  Public
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendErrorResponse(res, "User not found", 404);

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set reset token and expiry (valid for 1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `Click the link to reset your password: ${resetUrl}`;

        await sendEmail(user.email, "Password Reset Request", message);

        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

// ==========================
// 🔹 Reset Password Route
// ==========================
// @route   POST /api/auth/reset-password
// @desc    Resets the password after clicking the link
// @access  Public
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) return sendErrorResponse(res, "Invalid request");

        // Hash the token to compare with DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return sendErrorResponse(res, "Invalid or expired token", 400);

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("❌ Reset Password Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
});

module.exports = router;
