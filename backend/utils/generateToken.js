const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables.");
    }

    return jwt.sign(
        { userId }, // Payload
        process.env.JWT_SECRET, // Secret Key
        { expiresIn: "7d" } // Token Expiry (7 days)
    );
};

module.exports = generateToken;
