const express = require("express");

const Favorite = require("../models/Favorite");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


// ADD FAVORITE
router.post("/:songId", verifyToken, async (req, res) => {
    try {
        const { songId } = req.params;

        const existingFavorite = await Favorite.findOne({
            userId: req.userId,
            songId: songId
        });

        if (existingFavorite) {
            return res.status(400).json({
                message: "Song already in favorites"
            });
        }

        const favorite = await Favorite.create({
            userId: req.userId,
            songId: songId
        });

        res.status(201).json({
            message: "Added to favorites",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add favorite",
            error: error.message
        });
    }
});


// REMOVE FAVORITE
router.delete("/:songId", verifyToken, async (req, res) => {
    try {
        const { songId } = req.params;

        const deletedFavorite = await Favorite.findOneAndDelete({
            userId: req.userId,
            songId: songId
        });

        if (!deletedFavorite) {
            return res.status(404).json({
                message: "Favorite not found"
            });
        }

        res.json({
            message: "Removed from favorites"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove favorite",
            error: error.message
        });
    }
});


// GET MY FAVORITES
router.get("/", verifyToken, async (req, res) => {
    try {
        const favorites = await Favorite.find({
            userId: req.userId
        }).populate("songId");

        res.json(favorites);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get favorites",
            error: error.message
        });
    }
});


module.exports = router;