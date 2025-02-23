const jwt = require("jsonwebtoken");

// Utility function to extract token from header
const extractToken = (authHeader) => {
    if (!authHeader) return null;
    const tokenParts = authHeader.trim().split(/\s+/);
    return tokenParts.length === 2 && tokenParts[0] === "Bearer" ? tokenParts[1] : null;
};

// Middleware to Verify JWT Token
const authenticateUser = (req, res, next) => {
    try {
        const token = extractToken(req.header("Authorization"));

        if (!token) {
            console.warn("Unauthorized access attempt: No token provided.");
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        if (!process.env.JWT_SECRET) {
            console.error("❌ Server error: JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({ error: "Server configuration error." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.warn("Unauthorized access attempt: Invalid or expired token.");
                return res.status(403).json({ error: "Invalid or expired token." });
            }

            req.user = decoded; // Attach user data
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
    try {
        if (!req.user || req.user.role !== "admin") {
            console.warn(`Unauthorized admin access attempt by user ${req.user?.userId || "unknown"}`);
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        console.error("❌ Authorization error:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { authenticateUser, authorizeAdmin };
