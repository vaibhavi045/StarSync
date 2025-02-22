const express = require("express");
const { upload } = require("../utils/fileHandler");

const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.status(200).json({
        message: "File uploaded successfully!",
        filePath: req.file.path
    });
});

module.exports = router;
