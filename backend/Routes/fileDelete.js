const express = require("express");
const { deleteFile } = require("../utils/fileHandler");

const router = express.Router();

router.delete("/delete", async (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) return res.status(400).json({ error: "File path is required." });

        const result = await deleteFile(filePath);
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
