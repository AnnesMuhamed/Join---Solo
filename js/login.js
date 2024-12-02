function initIndex() {
    loginPage();
    initialize();
}

function loginPage() {
    let logInPage = document.getElementById('sectionlogin');

    logInPage.innerHTML = /*html*/ `
    <div id="overlay" class="overlay">
        <div id="logo-container">
            <img class="dark-logo" src="../assets/img/loginLogo.png" alt="Logo" id="main-logo-dark">
            <img class="white-logo" src="../assets/img/login-logo-rp.png" alt="Logo" id="main-logo-white">
        </div>
    </div>
    <div id="login-page" class="hidden">
        <div class="login-headline-container">
            <h1 class="login-headline">Log in</h1>
            <img class="blue-line" src="../assets/img/Vector 5.png" alt="">
        </div>
        <form id="login-form" onsubmit="handleLogin(event)">
            <label class="input-container">
                <input type="email" id="username" minlength="9" placeholder="Email" required oninput="validateInputs()">
                <img src="../assets/img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" placeholder="Password" minlength="4" required oninput="toggleIconOnInput(this)">
                <span class="lock-icon"></span> <!-- Schloss-Icon -->
                <span class="password-icon hidden" onclick="togglePasswordVisibility('password', this)"></span> <!-- Augen-Icon -->
            </label>
            <label class="option" for="option">
                <input type="checkbox" name="option" id="option" class="custom-checkbox">
                <span class="checkbox-custom"></span> Remember me
            </label>
        
            <div class="button-container">
                <button type="submit" class="login-button" disabled>Log in</button>
                <a href="summary.html">
                    <button type="button" class="guest-button">Guest Log in</button>
                </a>
            </div>
        </form>
    </div>
    <div class="signup-container hidden">
        <span class="not-a-user">Not a Join user?</span>
        <a href="sign-up.html"><button class="signup-button">Sign up</button></a>
    </div>
    <div class="link-container hidden">
        <a class="policy-notice" href="privacy-policy-external.html">Privacy Policy</a>
        <a class="policy-notice" href="legal-notice-external.html">Legal notice</a>
    </div>
    `;
}

function toggleIconOnInput(inputField) {
    const lockIcon = inputField.parentElement.querySelector('.lock-icon');
    const passwordIcon = inputField.parentElement.querySelector('.password-icon');
    
    if (inputField.value.length > 0) {
        lockIcon.classList.add('hidden');
        passwordIcon.classList.remove('hidden');
    } else {
        lockIcon.classList.remove('hidden');
        passwordIcon.classList.add('hidden');
    }
}

function togglePasswordVisibility(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    const isPasswordVisible = passwordInput.type === 'text';
    
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    icon.classList.toggle('password-visible', !isPasswordVisible);
}

function validateInputs() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');

    if (usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('option').checked;

    const users = await loadData('user');
    let userFound = null;

    for (const userId in users) {
        const user = users[userId];
        if (user.username === email && user.password === password) {
            userFound = { ...user, id: userId };
            break;
        }
    }

    if (userFound) {
        if (rememberMe) {
            localStorage.setItem('loggedInUser', JSON.stringify(userFound));
        } else {
            sessionStorage.setItem('loggedInUser', JSON.stringify(userFound));
        }
        window.location.href = 'summary.html';
    } else {
        alert('Falscher Benutzername oder Passwort');
    }
}

function initialize() {
    loginPage();

    setTimeout(() => {
        const overlay = document.getElementById('overlay');
        const logoContainer = document.getElementById('logo-container');
        const loginPage = document.getElementById('login-page');
        const signupContainer = document.querySelector('.signup-container');
        const linkContainer = document.querySelector('.link-container');
        const whiteLogo = document.getElementById('main-logo-white');
        const darkLogo = document.getElementById('main-logo-dark');

        overlay.classList.add('overlay-active'); 
        logoContainer.classList.add('move-to-corner');
        loginPage.classList.add('show');
        signupContainer.classList.add('show');
        linkContainer.classList.add('show');

        whiteLogo.style.display = 'none';
        darkLogo.style.display = 'block';
    }, 3000);
}
