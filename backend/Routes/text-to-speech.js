const express = require("express");
const say = require("say");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ensure 'public/audio' folder exists for storing speech files
const audioDir = path.join(__dirname, "..", "public", "audio");
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

router.post("/", async (req, res) => {
    try {
        const { text, voice = "Alex", speed = 1.0 } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        // Generate a unique filename for each request
        const filename = `speech-${Date.now()}.wav`;
        const filePath = path.join(audioDir, filename);

        // Convert text to speech and save as file
        say.export(text, voice, speed, filePath, (err) => {
            if (err) {
                console.error("❌ Text-to-Speech Error:", err);
                return res.status(500).json({ error: "Failed to generate speech" });
            }

            console.log(`✅ Speech file created: ${filePath}`);
            res.json({ message: "Speech generated successfully", audioUrl: `/public/audio/${filename}` });

            // Optional: Cleanup old audio files to save space
            setTimeout(() => {
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error("⚠️ Error deleting old speech file:", unlinkErr);
                    else console.log(`🗑️ Deleted old speech file: ${filePath}`);
                });
            }, 600000); // Deletes after 10 minutes

        });

    } catch (error) {
        console.error("❌ Unexpected Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
