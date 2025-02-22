const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/translate", async (req, res) => {
    const { text, targetLang } = req.body;

    try {
        const response = await axios.post("https://libretranslate.com/translate", {
            q: text,
            source: "auto",
            target: targetLang,
            format: "text"
        }, {
            headers: { "Content-Type": "application/json" }
        });

        res.json({ translatedText: response.data.translatedText });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});

module.exports = router;
