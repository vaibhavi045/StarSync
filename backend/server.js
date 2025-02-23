require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { PeerServer } = require("peer");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// Validate required environment variables
const REQUIRED_ENV_VARS = ["MONGO_URI", "PORT", "JWT_SECRET"];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length) {
    console.error(`❌ ERROR: Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
}

// Connect to MongoDB
connectDB();

// Safe route loading function
const safeRequire = (routePath, routeName) => {
    try {
        const route = require(routePath);
        console.log(`✅ Loaded route: ${routeName}`);
        return route;
    } catch (error) {
        console.error(`❌ Failed to load route [${routeName}]: ${error.message}`);
        return (req, res) => res.status(500).json({ error: `${routeName} route unavailable` });
    }
};

// Load API routes
app.use("/api/auth", safeRequire("./Routes/auth", "Auth"));
app.use("/api/speech-to-text", safeRequire("./Routes/speech", "Speech-to-Text"));
app.use("/api/translate", safeRequire("./Routes/translate", "Translate"));
app.use("/api/medical-data", safeRequire("./Routes/medicalData", "Medical Data"));
app.use("/api/files/upload", safeRequire("./Routes/fileUpload", "File Upload"));
app.use("/api/files/delete", safeRequire("./Routes/fileDelete", "File Delete"));

// Root endpoint
app.get("/", (req, res) => {
    res.send("🚀 Medical Screening API is Running...");
});

// Handle 404 routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start Express Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ Express Server Running on Port ${PORT}`);
});

// Start PeerJS Server
const peerServer = PeerServer({ port: 9000, path: "/peerjs" }, () => {
    console.log("✅ PeerJS Server Running on Port 9000");
});

// Graceful Shutdown Handling
const shutdown = async () => {
    console.log("\n🔴 Initiating graceful shutdown...");

    try {
        await mongoose.connection.close();
        console.log("✅ MongoDB Disconnected.");
    } catch (error) {
        console.error("⚠️ Error disconnecting MongoDB:", error.message);
    }

    peerServer._app.close(() => {
        console.log("✅ PeerJS Server Closed.");
    });

    server.close(() => {
        console.log("✅ Express Server Closed.");
        process.exit(0);
    });
};

// Handle termination signals
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, shutdown);
});

// Catch unexpected errors
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    console.error(err.stack);
    shutdown();
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
    shutdown();
});
