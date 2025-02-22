// Custom Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err.message);

    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

// Middleware for Handling 404 Routes
const notFound = (req, res, next) => {
    const error = new Error(`🔍 Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
