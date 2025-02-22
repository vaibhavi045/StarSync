require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Support URL-encoded data
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Logging middleware

// Environment Variables Validation
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });


// API Routes
app.get("/", (req, res) => {
    res.send("🚀 Medical Screening API is Running...");
});

// Load additional API routes with error handling
try {
    app.use("/api/speech-to-text", require("./Routes/speech"));
    app.use("/api/translate", require("./Routes/Translate"));
} catch (error) {
    console.error("❌ Error loading routes:", error);
}

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

// Graceful Shutdown Handling
const shutdown = async () => {
    console.log("\n🔴 Shutting down gracefully...");
    await mongoose.disconnect();
    server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);  // Handle Ctrl+C
process.on("SIGTERM", shutdown); // Handle termination signals (e.g., Docker, Kubernetes)
