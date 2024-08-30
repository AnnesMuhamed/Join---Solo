function loginPage() {
    let logInPage = document.getElementById('sectionLogin');

    logInPage.innerHTML = `
    <div id="overlay">
        <div id="logo-container">
            <img class="dark-logo" src="./img/loginLogo.png" alt="Logo" id="main-logo-dark">
            <img class="white-logo" src="./img/template/login-logo-rp.png" alt="Logo" id="main-logo-white">
        </div>
    </div>
    <div id="login-page" class="hidden">
        <div>
            <h1 class="login-headline">Log in</h1>
            <img class="blue-line" src="./img/Vector 5.png" alt="">
        </div>
        <form id="login-form">
            <label class="input-container">
                <input type="email" id="username" minlength="9" placeholder="Email" required>
                <img src="./img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" minlength="4" placeholder="Password" class="login-password" required>
                <img src="./img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <label class="option" for="option">
                <input type="checkbox" name="option" id="option"> Remember me
            </label>
        
            <div class="button-container">
                <button type="submit" class="login-button" disabled>Log in</button>
                <a href="./summary/summary.html">
                    <button type="button" class="guest-button">Guest Log in</button>
                </a>
            </div>
        </form>
    </div>
    <div class="signup-container hidden">
        <span class="not-a-user">Not a Join user?</span>
        <a href="./sign-up/sign-up.html"><button class="signup-button">Sign up</button></a>
    </div>
    <div class="link-container hidden">
        <a class="policy-notice" href="../privacy-policy/privacy-policy-external.html">Privacy Policy</a>
        <a class="policy-notice" href="../legal-notice/legal-notice-external.html">Legal notice</a>
    </div>
    `;

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');


    function validateInputs() {
        if (usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }

    usernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = usernameInput.value;
        const password = passwordInput.value;
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
            window.location.href = '../summary/summary.html';
        } else {
            alert('Falscher Benutzername oder Passwort');
        }
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
        let whiteLogo = document.getElementById('main-logo-white')
        let darkLogo = document.getElementById('main-logo-dark')

        overlay.style.opacity = 1;
        logoContainer.classList.add('move-to-corner');
        logoContainer.style.alignItems = 'flex-start';
        loginPage.style.display = 'flex';
        loginPage.classList.remove('hidden');
        signupContainer.classList.remove('hidden');
        linkContainer.classList.remove('hidden');
        overlay.style.backgroundColor = '#F6F7F8';
        whiteLogo.style.display = 'none';
        darkLogo.style.display = 'block';
        darkLogo.style.width = '64px';
        darkLogo.style.height = '78.03px';




        setTimeout(() => {
            overlay.style.width = '1440px';
            overlay.style.height = '1024px';
            overlay.style.display = 'hidden';
            overlay.style.alignItems = 'flex-start';
            overlay.style.justifyContent = 'flex-start';
        }, 500);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', initialize);
