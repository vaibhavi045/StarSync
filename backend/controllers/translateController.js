const { OpenAI } = require("openai");

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc   Translate text from one language to another
// @route  POST /api/translate
// @access Public
exports.translateText = async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: "Text and targetLanguage are required" });
        }

        // Use OpenAI API for Translation
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are a translation assistant. Translate the given text into ${targetLanguage}.` },
                { role: "user", content: text }
            ]
        });

        const translatedText = response.choices[0].message.content;

        res.json({ translatedText });

    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Failed to translate text" });
    }
};
