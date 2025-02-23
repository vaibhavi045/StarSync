const mongoose = require("mongoose");

const medicalDataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        symptoms: {
            type: [String],
            required: [true, "Symptoms are required"],
            validate: {
                validator: (arr) => arr.length > 0,
                message: "At least one symptom must be provided."
            }
        },
        diagnosis: {
            type: String,
            required: [true, "Diagnosis is required"],
            trim: true
        },
        prescription: {
            type: String,
            default: "No prescription provided",
            trim: true
        },
        reports: {
            type: [String],
            default: [],
            validate: {
                validator: (arr) => arr.every(url => /^https?:\/\/.+/.test(url)),
                message: "Each report must be a valid URL."
            }
        },
        language: {
            type: String,
            enum: ["en", "es", "fr", "de", "hi"],
            default: "en"
        }
    },
    { timestamps: true } // Adds createdAt & updatedAt automatically
);

const MedicalData = mongoose.model("MedicalData", medicalDataSchema);

module.exports = MedicalData;
