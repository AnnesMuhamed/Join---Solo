const BASE_URL = "https://join-232-default-rtdb.europe-west1.firebasedatabase.app/";

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}



function init() {
    let signUp = document.getElementById('sectionSignUp');

    signUp.innerHTML = `
    <div class="logo-container">
        <img src="/img/loginLogo.png" alt="Logo" class="main-logo">
    </div>

    <div class="container">
        <div class="header-container">
        <a href="/login/login.html">    
        <img src="/img/arrow-left-line.png" alt="Zurück" class="back-arrow">
        </a>
            <div class="header">
                Sign Up
            </div>
        </div>
        <div class="divider"></div>
        <form id="sign-up-form" class="form">
            <label class="input-container">
                <input type="text" id="first-name" placeholder="First Name" minlength="2" required>
                <img src="/img/person.png" alt="Name Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="text" id="last-name" placeholder="Last Name" minlength="2" required>
                <img src="/img/person.png" alt="Name Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                <img src="/img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" placeholder="Password" minlength="4" required>
                <img src="/img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
                <img src="/img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <div class="checkbox-container">
                <input type="checkbox" id="accept-policy" required>
                <label for="accept-policy">I accept the <a href="#" class="privacy-policy">Privacy policy</a></label>
            </div>
            <button type="submit" class="sign-up-button">Sign Up</button>
        </form>
    </div>
    <div class="link-container">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    </div>
    `;

    const signUpForm = document.getElementById('sign-up-form');
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Passwort stimmit nicht überein");
            return;
        }

        await createUser(firstName, lastName, email, password);
        alert("Benutzer erfolgreich erstellt!");
        window.location.href = '/login/login.html';
    });
}

async function createUser(firstName, lastName, email, password) {
    const newUser = { firstName, lastName, username: email, password };
    await postData('user', newUser);
}


document.addEventListener('DOMContentLoaded', init);
