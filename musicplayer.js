// ============================================
// MELODYHUB MUSIC PLAYER
// ============================================


// ============================================
// LOGIN CHECK
// ============================================

const loggedInUser =
    JSON.parse(localStorage.getItem("user"));

const token =
    localStorage.getItem("token");


if (!token || !loggedInUser) {

    window.location.href = "auth.html";

}


// ============================================
// USER INFORMATION
// ============================================

const welcomeUser =
    document.getElementById("welcome-user");

if (welcomeUser && loggedInUser) {

    welcomeUser.textContent =
        `Welcome, ${loggedInUser.name}`;

}


// ============================================
// LOGOUT
// ============================================

const logoutBtn =
    document.getElementById("logout-btn");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "auth.html";

    };

}


// ============================================
// SONGS
// ============================================

let songs = [];

let current = 0;


// ============================================
// HTML ELEMENTS
// ============================================

const titleEl =
    document.getElementById("song-title");

const artistEl =
    document.getElementById("artist");

const coverEl =
    document.getElementById("cover");

const audio =
    document.getElementById("audio");

const playPauseBtn =
    document.getElementById("play-pause");

const libraryDiv =
    document.getElementById("library");


// ============================================
// LOAD SONGS FROM MONGODB
// ============================================

async function loadSongs() {

    try {

        const response =
            await fetch(
                "https://music-player-web-application-j8xs.onrender.com/api/songs"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load songs"
            );

        }


        songs =
            await response.json();


        console.log(
            "Songs loaded:",
            songs
        );


        if (songs.length === 0) {

            libraryDiv.innerHTML =
                "<p>No songs available.</p>";

            return;

        }


        loadSong(current);

        displayLibrary(songs);


    } catch (error) {

        console.error(
            "Song loading error:",
            error
        );

        libraryDiv.innerHTML =
            "<p>Unable to load songs.</p>";

    }

}


// ============================================
// LOAD SINGLE SONG
// ============================================

function loadSong(idx) {

    if (!songs.length) {
        return;
    }


    const s = songs[idx];


    // Song title
    titleEl.textContent =
        s.title;


    // Artist
    artistEl.textContent =
        s.artist;


    // ========================================
    // COVER IMAGE
    // ========================================

    if (s.cover.startsWith("http")) {

        coverEl.src =
            s.cover;

    } else {

        coverEl.src =
            `https://music-player-web-application-j8xs.onrender.com/images/${encodeURIComponent(s.cover)}`;

    }


    // ========================================
    // AUDIO
    // ========================================

    if (s.src.startsWith("http")) {

        audio.src =
            s.src;

    } else {

        audio.src =
            `https://music-player-web-application-j8xs.onrender.com/music/${encodeURIComponent(s.src)}`;

    }


    audio.pause();


    playPauseBtn.textContent =
        "▶️ Play";

}


// ============================================
// DISPLAY SONG LIBRARY
// ============================================

function displayLibrary(arr) {

    libraryDiv.innerHTML = "";


    arr.forEach(s => {

        const card =
            document.createElement("div");


        card.className =
            "song-card";


        // ====================================
        // COVER URL
        // ====================================

        const coverUrl =
            s.cover.startsWith("http")
                ? s.cover
                : `https://music-player-web-application-j8xs.onrender.com/images/${encodeURIComponent(s.cover)}`;


        // ====================================
        // SONG CARD
        // ====================================

        card.innerHTML = `

            <img
                src="${coverUrl}"
                alt="${s.title}"
            >

            <div class="song-info">

                <strong>
                    ${s.title}
                </strong>

                <br>

                <small>
                    ${s.artist}
                </small>

            </div>


            <div class="song-actions">

                <button
                    class="favorite-btn"
                    title="Add to favorites"
                >
                    ❤️
                </button>


                <button
                    class="add-playlist-btn"
                    title="Add to playlist"
                >
                    ➕ Playlist
                </button>

            </div>

        `;


        // ====================================
        // FAVORITE BUTTON
        // ====================================

        const favoriteBtn =
            card.querySelector(
                ".favorite-btn"
            );


        favoriteBtn.onclick =
            async (event) => {

                event.stopPropagation();


                await addFavorite(
                    s._id,
                    favoriteBtn
                );

            };


        // ====================================
        // PLAYLIST BUTTON
        // ====================================

        const playlistBtn =
            card.querySelector(
                ".add-playlist-btn"
            );


        playlistBtn.onclick =
            async (event) => {

                event.stopPropagation();


                await showPlaylistsForSong(
                    s
                );

            };


        // ====================================
        // PLAY SONG
        // ====================================

        card.onclick = () => {

            current =
                songs.indexOf(s);


            loadSong(current);


            audio.play();


            playPauseBtn.textContent =
                "⏸ Pause";

        };


        libraryDiv.appendChild(card);

    });

}


// ============================================
// FILTER SONGS
// ============================================

function filterSongs(lang) {

    const filteredSongs =
        lang === "All"
            ? songs
            : songs.filter(
                s => s.language === lang
            );


    displayLibrary(
        filteredSongs
    );

}


// ============================================
// PREVIOUS SONG
// ============================================

const prevBtn =
    document.getElementById("prev");


if (prevBtn) {

    prevBtn.onclick = () => {

        if (!songs.length) {
            return;
        }


        current =
            (current - 1 + songs.length)
            % songs.length;


        loadSong(current);


        audio.play();


        playPauseBtn.textContent =
            "⏸ Pause";

    };

}


// ============================================
// NEXT SONG
// ============================================

const nextBtn =
    document.getElementById("next");


if (nextBtn) {

    nextBtn.onclick = () => {

        if (!songs.length) {
            return;
        }


        current =
            (current + 1)
            % songs.length;


        loadSong(current);


        audio.play();


        playPauseBtn.textContent =
            "⏸ Pause";

    };

}


// ============================================
// PLAY / PAUSE
// ============================================

if (playPauseBtn) {

    playPauseBtn.onclick = () => {

        if (audio.paused) {

            audio.play();

            playPauseBtn.textContent =
                "⏸ Pause";

        } else {

            audio.pause();

            playPauseBtn.textContent =
                "▶️ Play";

        }

    };

}


// ============================================
// AUTO NEXT SONG
// ============================================

audio.onended = () => {

    if (!songs.length) {
        return;
    }


    current =
        (current + 1)
        % songs.length;


    loadSong(current);


    audio.play();


    playPauseBtn.textContent =
        "⏸ Pause";

};


// ============================================
// ADD FAVORITE
// ============================================

async function addFavorite(
    songId,
    button
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login first!"
        );

        window.location.href =
            "auth.html";

        return;

    }


    try {

        const response =
            await fetch(

                `https://music-player-web-application-j8xs.onrender.com/api/favorites/${songId}`,

                {
                    method: "POST",

                    headers: {


                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const data =
            await response.json();


        if (!response.ok) {

            if (
                data.message ===
                "Song already in favorites"
            ) {

                alert(
                    "Song is already in your favorites ❤️"
                );

            } else {

                alert(
                    data.message ||
                    "Could not add favorite"
                );

            }

            return;

        }


        button.textContent =
            "💖";


        alert(
            "Added to favorites ❤️"
        );


    } catch (error) {

        console.error(
            "Favorite error:",
            error
        );


        alert(
            "Could not add favorite"
        );

    }

}


// ============================================
// SHOW PLAYLISTS FOR SONG
// ============================================

async function showPlaylistsForSong(
    song
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login first."
        );

        return;

    }


    try {

        const response =
            await fetch(

                "https://music-player-web-application-j8xs.onrender.com/api/playlists",

                {
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const playlists =
            await response.json();


        if (!response.ok) {

            alert(
                playlists.message ||
                "Could not load playlists"
            );

            return;

        }


        if (playlists.length === 0) {

            alert(
                "You don't have any playlists. Create one first."
            );

            return;

        }


        let message =
            "Select a playlist:\n\n";


        playlists.forEach(
            (playlist, index) => {

                message +=
                    `${index + 1}. ${playlist.name}\n`;

            }
        );


        const choice =
            prompt(message);


        if (!choice) {
            return;
        }


        const index =
            parseInt(choice) - 1;


        if (
            index < 0 ||
            index >= playlists.length
        ) {

            alert(
                "Invalid playlist."
            );

            return;

        }


        const selectedPlaylist =
            playlists[index];


        // Add song to selected playlist

        const addResponse =
            await fetch(

                `https://music-player-web-application-j8xs.onrender.com/api/playlists/${selectedPlaylist._id}/songs/${song._id}`,

                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const result =
            await addResponse.json();


        if (!addResponse.ok) {

            alert(
                result.message ||
                "Could not add song"
            );

            return;

        }


        alert(
            `"${song.title}" added to "${selectedPlaylist.name}" 🎵`
        );


    } catch (error) {

        console.error(
            "Playlist error:",
            error
        );


        alert(
            "Could not connect to server."
        );

    }

}


// ============================================
// START APPLICATION
// ============================================

loadSongs();