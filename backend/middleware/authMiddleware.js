const jwt = require("jsonwebtoken");

// Middleware to Verify JWT Token
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // Check if token is missing
        if (!authHeader) {
            console.warn("Unauthorized access attempt: No token provided.");
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Extract token from 'Bearer <token>'
        const tokenParts = authHeader.trim().split(/\s+/);
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            console.warn("Unauthorized access attempt: Invalid token format.");
            return res.status(401).json({ error: "Invalid token format." });
        }

        // Verify JWT
        const token = tokenParts[1];
        if (!process.env.JWT_SECRET) {
            console.error("❌ Server error: JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({ error: "Server configuration error." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.warn("Unauthorized access attempt: Invalid or expired token.");
                return res.status(403).json({ error: "Invalid or expired token." });
            }

            req.user = decoded; // Attach full user data
            req.userId = decoded.userId; // Ensure userId is explicitly attached
            next();
        });

    } catch (error) {
        console.error("❌ Authentication error:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Middleware to Authorize Admin Users
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        console.warn(`Unauthorized access attempt by user ${req.user?.id || "unknown"}`);
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

module.exports = { authenticateUser, authorizeAdmin };
