const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/speech-to-text", async (req, res) => {
    exec("whisper audio.mp3 --model tiny", (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        res.json({ text: stdout });
    });
});

module.exports = router;
