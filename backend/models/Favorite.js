const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        songId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Same user cannot favorite the same song twice
favoriteSchema.index(
    { userId: 1, songId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);