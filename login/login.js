const BASE_URL = "https://join-232-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunc() {
    console.log("test");
    loadData();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

function loginPage() {
    let logInPage = document.getElementById('sectionLogin');

    logInPage.innerHTML = `
    <div id="overlay">
        <div id="logo-container">
            <img src="/img/logo.png" alt="Logo" id="main-logo">
        </div>
    </div>
    <div id="login-page" class="hidden">
        <div>
            <h1 class="login-headline">Log in</h1>
            <img class="blue-line" src="/img/Vector 5.png" alt="">
        </div>
        <form id="login-form">
            <label class="input-container">
                <input type="email" id="username" minlength="9" placeholder="Email" required>
                <img src="/img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" minlength="4" placeholder="Password" required>
                <img src="/img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <label class="option" for="option">
                <input type="checkbox" name="option" id="option"> Remember me
            </label>
            <div class="button-container">
                <button type="submit" class="login-button">Log in</button>
                <button type="button" class="guest-button">Guest Log in</button>
            </div>
        </form>
    </div>
    <div class="signup-container hidden">
        <span class="not-a-user">Not a Join user?</span>
        <a href="sign-up.html"><button class="signup-button">Sign up</button></a>
    </div>
    <div class="link-container hidden">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Verhindert das Standardformular-Absendeverhalten

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const data = { username, password };
        await postData('contacts', data);

        // Optional: Leere die Felder nach dem Absenden
        document.getElementById('login-form').reset();
    });
}

function initialize() {
    loginPage();

    setTimeout(() => {
        const overlay = document.getElementById('overlay');
        const logoContainer = document.getElementById('logo-container');
        const loginPage = document.getElementById('login-page');
        const signupContainer = document.querySelector('.signup-container');
        const linkContainer = document.querySelector('.link-container');

        overlay.style.opacity = 1;
        logoContainer.classList.add('move-to-corner');
        loginPage.style.display = 'flex';
        signupContainer.classList.remove('hidden');
        linkContainer.classList.remove('hidden');

        setTimeout(() => {
            overlay.style.width = '0';
            overlay.style.height = '0';
            overlay.style.overflow = 'hidden';
        }, 500);
    }, 3000);
}
