const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Utility function for sending error responses
const sendErrorResponse = (res, message, status = 400) => res.status(status).json({ error: message });

// Utility function to generate JWT token
const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc   Register a new user
// @route  POST /api/auth/signup
// @access Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return sendErrorResponse(res, "All fields are required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return sendErrorResponse(res, "Invalid email format");

        if (password.length < 6) return sendErrorResponse(res, "Password must be at least 6 characters long");

        const existingUser = await User.findOne({ email });
        if (existingUser) return sendErrorResponse(res, "User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(newUser.id);

        res.status(201).json({ token, userId: newUser.id, name: newUser.name, email: newUser.email });
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

        const token = generateToken(user.id);

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
