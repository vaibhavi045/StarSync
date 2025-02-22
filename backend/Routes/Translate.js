const express = require("express");
const axios = require("axios");

const router = express.Router();

// Load LibreTranslate API settings from environment variables
const LIBRE_TRANSLATE_URL = process.env.LIBRE_TRANSLATE_URL || "https://libretranslate.de/translate";
const LIBRE_TRANSLATE_API_KEY = process.env.LIBRE_TRANSLATE_API_KEY || null; // Optional API key

// Translation Route
router.post("/", async (req, res) => {
    try {
        const { text, targetLanguage, sourceLanguage = "auto" } = req.body;

        // Input Validation
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: "Text and targetLanguage are required." });
        }

        console.log(`🌍 Translating "${text}" from ${sourceLanguage} to ${targetLanguage}...`);

        // Construct request payload
        const payload = {
            q: text,
            source: sourceLanguage, // Default to 'auto' for automatic language detection
            target: targetLanguage,
            format: "text"
        };

        // Include API key if available
        if (LIBRE_TRANSLATE_API_KEY) {
            payload.api_key = LIBRE_TRANSLATE_API_KEY;
        }

        // Request to LibreTranslate API
        const response = await axios.post(LIBRE_TRANSLATE_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        // Validate API response
        if (!response.data || !response.data.translatedText) {
            throw new Error("Invalid response from translation API");
        }

        console.log(`✅ Translation Successful: ${response.data.translatedText}`);

        // Sending Response
        res.json({
            originalText: text,
            translatedText: response.data.translatedText,
            sourceLanguage: sourceLanguage === "auto" ? "detected" : sourceLanguage,
            targetLanguage
        });

    } catch (error) {
        console.error("❌ Translation Error:", error.message);

        res.status(500).json({
            error: "Failed to translate text.",
            details: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;
