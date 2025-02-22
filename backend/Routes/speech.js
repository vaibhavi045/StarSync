const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter to allow only audio files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only MP3, WAV, OGG, and MP4 files are allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });

// Initialize OpenAI Whisper API
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY is missing in environment variables!");
    process.exit(1); // Stop the server if API key is missing
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Speech-to-Text Route
router.post("/convert", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFilePath = req.file.path;
    console.log(`✅ File uploaded: ${audioFilePath}`);

    try {
        // Use OpenAI Whisper API for Speech-to-Text
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1",
            response_format: "json",
        });

        // Ensure the uploaded file is deleted after processing
        fs.unlink(audioFilePath, (err) => {
            if (err) console.error("⚠️ Error deleting file:", err);
            else console.log(`🗑️ Deleted file: ${audioFilePath}`);
        });

        return res.json({ text: response.text });

    } catch (error) {
        console.error("❌ Speech-to-Text Error:", error);

        // Ensure the uploaded file is deleted if an error occurs
        fs.unlink(audioFilePath, (err) => {
            if (err) console.error("⚠️ Error deleting file:", err);
        });

        const errorMessage = error.response?.data?.error || error.message || "Failed to process audio";
        return res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;
