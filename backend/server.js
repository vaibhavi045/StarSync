require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Environment Variables Validation
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file!");
    process.exit(1); // Exit if MongoDB URI is missing
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if MongoDB fails to connect
    });

// API Routes
app.get("/", (req, res) => {
    res.send("🚀 Medical Screening API is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
