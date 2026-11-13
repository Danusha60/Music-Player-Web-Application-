// Get logged-in user information
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));


// Check whether user is logged in
if (!token || !user) {
    window.location.href = "auth.html";
}


// Get HTML elements
const favoritesLibrary =
    document.getElementById("favorites-library");

const emptyMessage =
    document.getElementById("empty-message");


// ===============================
// LOAD FAVORITES
// ===============================

async function loadFavorites() {

    try {

        const response = await fetch(
            "https://music-player-web-application-j8xs.onrender.com/api/favorites",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const favorites = await response.json();


        console.log("My favorites:", favorites);


        // Check API error
        if (!response.ok) {

            emptyMessage.textContent =
                favorites.message || "Unable to load favorites.";

            return;
        }


        // No favorites
        if (favorites.length === 0) {

            emptyMessage.textContent =
                "You haven't added any favorites yet ❤️";

            return;
        }


        // Display favorites
        favorites.forEach(favorite => {

            const song = favorite.songId;


            // Create card
            const card = document.createElement("div");

            card.className = "song-card";


            // Image URL
            const coverUrl =
                song.cover.startsWith("http")
                    ? song.cover
                    : `http://localhost:5000/images/${encodeURIComponent(song.cover)}`;


            // Card HTML
            card.innerHTML = `
                
                <img
                    src="${coverUrl}"
                    alt="${song.title}"
                >

                <div>
                    <strong>${song.title}</strong>
                    <br>
                    <small>${song.artist}</small>
                </div>

                <button class="remove-btn">
                    💔 Remove
                </button>

            `;


            // Get remove button
            const removeBtn =
                card.querySelector(".remove-btn");


            // Remove favorite
            removeBtn.onclick = async () => {

                await removeFavorite(
                    song._id,
                    card
                );

            };


            // Add card to page
            favoritesLibrary.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Favorites loading error:",
            error
        );

        emptyMessage.textContent =
            "Unable to connect to the server.";

    }
}


// ===============================
// REMOVE FAVORITE
// ===============================

async function removeFavorite(songId, card) {

    try {

        const response = await fetch(

            `http://localhost:5000/api/favorites/${songId}`,

            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }

        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Could not remove favorite"
            );

            return;
        }


        // Remove card from screen
        card.remove();


        alert("Removed from favorites 💔");


        // Check if there are no cards left
        if (favoritesLibrary.children.length === 0) {

            emptyMessage.textContent =
                "You haven't added any favorites yet ❤️";
        }


    } catch (error) {

        console.error(
            "Remove favorite error:",
            error
        );

        alert("Could not remove favorite");

    }

}


// ===============================
// LOGOUT
// ===============================

document.getElementById("logout-btn").onclick = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "auth.html";

};


// ===============================
// START
// ===============================

loadFavorites();