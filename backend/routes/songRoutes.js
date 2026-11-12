const express = require("express");
const Song = require("../models/song");

const router = express.Router();

// Get all songs
router.get("/", async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching songs",
            error: error.message
        });
    }
});

module.exports = router;