const mongoose = require("mongoose");
require("dotenv").config();

const Song = require("./models/Song");

const melodyHubSongs = [
    {
        title: "Believer",
        artist: "Imagine Dragons",
        src: "Believer.mp3",
        cover: "Beliver.png",
        language: "English"
    },
    {
        title: "Die with a Smile",
        artist: "Bruno Mars",
        src: "Die With A Smile - (Raag.Fm).mp3",
        cover: "Die with a smile.png",
        language: "English"
    },
    {
        title: "Lover",
        artist: "Taylor Swift",
        src: "Lover(PagalWorld).mp3",
        cover: "Lover.png",
        language: "English"
    },
    {
        title: "Moral-Of-The-Story",
        artist: "Ashe",
        src: "Moral-Of-The-Story.mp3",
        cover: "Moral of the story.png",
        language: "English"
    },
    {
        title: "Acoustic Breeze",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
        cover: "https://www.bensound.com/bensound-img/acousticbreeze.jpg",
        language: "English"
    },
    {
        title: "Creative Minds",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
        cover: "https://www.bensound.com/bensound-img/creativeminds.jpg",
        language: "English"
    },
    {
        title: "Energy",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
        cover: "https://www.bensound.com/bensound-img/energy.jpg",
        language: "English"
    },
    {
        title: "Once Again",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3",
        cover: "https://www.bensound.com/bensound-img/onceagain.jpg",
        language: "English"
    },
    {
        title: "Shankerdada M.B.B.S",
        artist: "Mani Sharma",
        src: "Shankerdada.mp3",
        cover: "shankerdada.png",
        language: "Telugu"
    },
    {
        title: "Hungry Cheeetah",
        artist: "Thaman.S",
        src: "Hungry Cheetah.mp3",
        cover: "hungry cheetah.png",
        language: "Telugu"
    },
    {
        title: "Piliche",
        artist: "Manisarma",
        src: "Piliche.mp3",
        cover: "Piliche.png",
        language: "Telugu"
    },
    {
        title: "Naatu Naatu",
        artist: "M.M. Keeravani",
        src: "Naatu Naatu.mp3",
        cover: "naatu naatu.png",
        language: "Telugu"
    },
    {
        title: "Idhedho Bagundhe",
        artist: "Devi Sri Prasad",
        src: "Idhedho Bagundhe.mp3",
        cover: "mirchi.png",
        language: "Telugu"
    },
    {
        title: "Julayi",
        artist: "Yuvan Shankar Raja",
        src: "july.mp3",
        cover: "july.png",
        language: "Telugu"
    },
    {
        title: "Vaaste",
        artist: "Dhvani Bhanushali",
        src: "Vaaste.mp3",
        cover: "Vaaste.png",
        language: "Hindi"
    },
    {
        title: "What Jhumka",
        artist: "Amit Trivedi",
        src: "What Jhumka.mp3",
        cover: "what jumka.png",
        language: "Hindi"
    },
    {
        title: "Dhol Bhaje",
        artist: "Amit Trivedi",
        src: "Dhol Bhaje.mp3",
        cover: "dhol bhaje.png",
        language: "Hindi"
    },
    {
        title: "Kesariya",
        artist: "Arijit Singh",
        src: "Kesariya.mp3",
        cover: "Kesariya.png",
        language: "Hindi"
    }
];

async function fillMelodyHub() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("Connected to MelodyHub database");

        await Song.deleteMany();

        await Song.insertMany(melodyHubSongs);

        console.log(`${melodyHubSongs.length} songs added successfully!`);

        await mongoose.connection.close();

        console.log("Database connection closed");
    } catch (error) {
        console.log("Error adding songs:", error.message);
    }
}

fillMelodyHub();