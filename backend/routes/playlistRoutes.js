const express = require("express");

const Playlist = require("../models/Playlist");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE PLAYLIST
router.post("/", verifyToken, async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Playlist name is required"
            });
        }

        const playlist = await Playlist.create({
            name: name.trim(),
            userId: req.userId,
            songs: []
        });

        res.status(201).json({
            message: "Playlist created successfully",
            playlist
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to create playlist",
            error: error.message
        });

    }

});


// GET MY PLAYLISTS
router.get("/", verifyToken, async (req, res) => {

    try {

        const playlists = await Playlist.find({
            userId: req.userId
        }).populate("songs");

        res.json(playlists);

    } catch (error) {

        res.status(500).json({
            message: "Failed to get playlists",
            error: error.message
        });

    }

});


// ADD SONG TO PLAYLIST
router.post("/:playlistId/songs/:songId", verifyToken, async (req, res) => {

    try {

        const { playlistId, songId } = req.params;

        const playlist = await Playlist.findOne({
            _id: playlistId,
            userId: req.userId
        });

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        if (playlist.songs.includes(songId)) {
            return res.status(400).json({
                message: "Song already exists in playlist"
            });
        }

        playlist.songs.push(songId);

        await playlist.save();

        res.json({
            message: "Song added to playlist",
            playlist
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to add song",
            error: error.message
        });

    }

});


// REMOVE SONG FROM PLAYLIST
router.delete("/:playlistId/songs/:songId", verifyToken, async (req, res) => {

    try {

        const { playlistId, songId } = req.params;

        const playlist = await Playlist.findOne({
            _id: playlistId,
            userId: req.userId
        });

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        playlist.songs =
            playlist.songs.filter(
                id => id.toString() !== songId
            );

        await playlist.save();

        res.json({
            message: "Song removed from playlist"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to remove song",
            error: error.message
        });

    }

});


// DELETE PLAYLIST
router.delete("/:playlistId", verifyToken, async (req, res) => {

    try {

        const { playlistId } = req.params;

        const playlist =
            await Playlist.findOneAndDelete({
                _id: playlistId,
                userId: req.userId
            });

        if (!playlist) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        res.json({
            message: "Playlist deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete playlist",
            error: error.message
        });

    }

});


module.exports = router;