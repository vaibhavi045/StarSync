const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();

// MongoDB Connection Function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit the process if DB connection fails
    }
};

// Export the function
module.exports = connectDB;

