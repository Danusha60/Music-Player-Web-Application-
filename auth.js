const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");

const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");


// Switch to Register
showRegisterBtn.onclick = () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
};


// Switch to Login
showLoginBtn.onclick = () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
};


// REGISTER
document.getElementById("register-form").onsubmit = async (e) => {

    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const message = document.getElementById("register-message");

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        message.textContent = "Registration successful!";

        document.getElementById("register-form").reset();

        setTimeout(() => {
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        }, 1000);

    } catch (error) {

        message.textContent =
            "Unable to connect to server.";

        console.error(error);
    }
};


// LOGIN
document.getElementById("login-form").onsubmit = async (e) => {

    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const message = document.getElementById("login-message");

    try {

        const response = await fetch(
            "https://music-player-web-application-j8xs.onrender.com/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        // Save login information
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        message.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {

        message.textContent =
            "Unable to connect to server.";

        console.error(error);
    }
};