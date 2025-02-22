const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Utility function for sending error responses
const sendErrorResponse = (res, message, status = 400) => res.status(status).json({ error: message });

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return sendErrorResponse(res, "All fields are required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return sendErrorResponse(res, "Invalid email format");

        if (password.length < 6) return sendErrorResponse(res, "Password must be at least 6 characters long");

        let user = await User.findOne({ email });
        if (user) return sendErrorResponse(res, "User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("Register Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
};

// @desc   Login user & get token
// @route  POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return sendErrorResponse(res, "All fields are required");

        const user = await User.findOne({ email });
        if (!user) return sendErrorResponse(res, "Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendErrorResponse(res, "Invalid credentials");

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("Login Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
};

// @desc   Get user data (protected route)
// @route  GET /api/auth/user
// @access Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password"); // Exclude password field
        if (!user) return sendErrorResponse(res, "User not found", 404);
        res.json(user);
    } catch (error) {
        console.error("User Fetch Error:", error);
        sendErrorResponse(res, "Server error", 500);
    }
};
