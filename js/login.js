function initIndex() {
    loginPage();
    initialize();
}

function loginPage() {
    const logInPage = document.getElementById('sectionlogin');
    logInPage.innerHTML = generateLoginPageTemplate();
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
