const mongoose = require("mongoose");

const medicalDataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References the User model
            required: true
        },
        symptoms: {
            type: [String], // Array of symptoms
            required: true
        },
        diagnosis: {
            type: String, // Diagnosed condition
            required: true
        },
        prescription: {
            type: String, // Suggested medication or treatment
            default: "No prescription provided"
        },
        reports: {
            type: [String], // URLs or paths to medical reports
            default: []
        },
        language: {
            type: String,
            enum: ["en", "es", "fr", "de", "hi"], // Example: English, Spanish, French, German, Hindi
            default: "en"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Create the model from schema
const MedicalData = mongoose.model("MedicalData", medicalDataSchema);

module.exports = MedicalData;
