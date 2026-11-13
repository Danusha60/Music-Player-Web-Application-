const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));


// Check login
if (!token || !user) {
    window.location.href = "auth.html";
}


const playlistsContainer =
    document.getElementById("playlists-container");

const createPlaylistBtn =
    document.getElementById("create-playlist-btn");

const selectedSection =
    document.getElementById("selected-playlist-section");

const selectedTitle =
    document.getElementById("selected-playlist-title");

const playlistSongs =
    document.getElementById("playlist-songs");


// ======================================
// LOAD PLAYLISTS
// ======================================

async function loadPlaylists() {

    try {

        const response = await fetch(
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


        playlistsContainer.innerHTML = "";


        if (playlists.length === 0) {

            playlistsContainer.innerHTML = `
                <p>
                    You don't have any playlists yet 🎵
                </p>
            `;

            return;
        }


        playlists.forEach(playlist => {

            const card =
                document.createElement("div");

            card.className =
                "playlist-card";


            card.innerHTML = `

                <div class="playlist-icon">
                    🎵
                </div>

                <h3>
                    ${playlist.name}
                </h3>

                <p>
                    ${playlist.songs.length} songs
                </p>

                <button class="open-playlist">
                    Open
                </button>

                <button class="delete-playlist">
                    🗑 Delete
                </button>

            `;


            // Open playlist

            card.querySelector(
                ".open-playlist"
            ).onclick = () => {

                showPlaylist(playlist);

            };


            // Delete playlist

            card.querySelector(
                ".delete-playlist"
            ).onclick = async () => {

                await deletePlaylist(
                    playlist._id
                );

            };


            playlistsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Playlist error:",
            error
        );

    }

}


// ======================================
// SHOW PLAYLIST SONGS
// ======================================

function showPlaylist(playlist) {

    selectedSection.style.display =
        "block";


    selectedTitle.textContent =
        `📋 ${playlist.name}`;


    playlistSongs.innerHTML = "";


    if (playlist.songs.length === 0) {

        playlistSongs.innerHTML = `
            <p>
                This playlist is empty 🎵
            </p>
        `;

        return;
    }


    playlist.songs.forEach(song => {

        const card =
            document.createElement("div");

        card.className =
            "song-card";


        const coverUrl =
            song.cover.startsWith("http")
                ? song.cover
                : `http://localhost:5000/images/${encodeURIComponent(song.cover)}`;


        card.innerHTML = `

            <img
                src="${coverUrl}"
                alt="${song.title}"
            >

            <div>

                <strong>
                    ${song.title}
                </strong>

                <br>

                <small>
                    ${song.artist}
                </small>

            </div>

            <button class="remove-song">
                💔 Remove
            </button>

        `;


        card.querySelector(
            ".remove-song"
        ).onclick = async () => {

            await removeSong(
                playlist._id,
                song._id
            );

        };


        playlistSongs.appendChild(card);

    });

}


// ======================================
// REMOVE SONG
// ======================================

async function removeSong(
    playlistId,
    songId
) {

    try {

        const response = await fetch(

            `http://localhost:5000/api/playlists/${playlistId}/songs/${songId}`,

            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not remove song"
            );

            return;

        }


        alert(
            "Song removed from playlist 💔"
        );


        loadPlaylists();


        selectedSection.style.display =
            "none";


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to server"
        );

    }

}


// ======================================
// DELETE PLAYLIST
// ======================================

async function deletePlaylist(
    playlistId
) {

    const confirmDelete =
        confirm(
            "Delete this playlist?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(

            `http://localhost:5000/api/playlists/${playlistId}`,

            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not delete playlist"
            );

            return;

        }


        alert(
            "Playlist deleted 🗑"
        );


        selectedSection.style.display =
            "none";


        loadPlaylists();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to server"
        );

    }

}


// ======================================
// CREATE PLAYLIST
// ======================================

createPlaylistBtn.onclick =
    async () => {

        const name =
            prompt(
                "Enter playlist name:"
            );


        if (!name) {
            return;
        }


        try {

            const response =
                await fetch(

                    "http://localhost:5000/api/playlists",

                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({
                            name: name
                        })

                    }

                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message
                );

                return;

            }


            alert(
                `Playlist "${name}" created successfully! 🎵`
            );


            loadPlaylists();


        } catch (error) {

            console.error(error);

            alert(
                "Could not create playlist"
            );

        }

    };


// ======================================
// LOGOUT
// ======================================

document.getElementById(
    "logout-btn"
).onclick = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "auth.html";

};


// ======================================
// START
// ======================================

loadPlaylists();