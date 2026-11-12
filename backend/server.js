const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// ROUTES
// ===============================

const songRoutes = require("./routes/songRoutes");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const playlistRoutes = require("./routes/playlistRoutes");


// ===============================
// SERVE IMAGES
// ===============================

app.use(
    "/images",
    express.static(
        path.join(__dirname, "public", "images")
    )
);


// ===============================
// SERVE MUSIC
// ===============================

app.use(
    "/music",
    express.static(
        path.join(__dirname, "public", "music")
    )
);


// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/songs", songRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/playlists", playlistRoutes);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    res.send(
        "MelodyHub Backend is Running!"
    );

});


// ===============================
// MONGODB
// ===============================

mongoose.connect(process.env.MONGO_URL)

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

       

    })

    .catch((error) => {

        console.log(
            "MongoDB connection failed:",
            error.message
        );

    }); const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});