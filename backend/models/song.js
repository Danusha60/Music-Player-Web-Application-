const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    artist: {
        type: String,
        required: true
    },

    src: {
        type: String,
        required: true
    },

    cover: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Song", songSchema);