const fs = require("fs");
const { OpenAI } = require("openai");

// Initialize OpenAI Whisper API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc   Convert Speech to Text using OpenAI Whisper API
// @route  POST /api/speech-to-text/convert
// @access Public
exports.convertSpeechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const audioFilePath = req.file.path;

        // Convert Speech to Text
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1",
            response_format: "json"
        });

        // Delete the uploaded file after processing
        fs.unlinkSync(audioFilePath);

        res.json({ text: response.text });
    } catch (error) {
        console.error("Speech-to-Text Error:", error);
        res.status(500).json({ error: "Failed to process audio" });
    }
};
