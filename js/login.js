/**
 * Initializes the index page by displaying the login page and running additional initialization logic.
 */
function initIndex() {
    loginPage();
    initialize();
}

/**
 * Displays the login page by setting the inner HTML of the login section 
 * with the login page template.
 */
// function loginPage() {
//     let logInPage = document.getElementById('sectionlogin');
//     logInPage.innerHTML = generateLoginPageTemplate();
// }

function loginPage() {
    let logInPage = document.getElementById('sectionlogin');
    logInPage.innerHTML = generateLoginPageTemplate();
}


/**
 * Toggles the visibility of the lock and password icons based on the input field's value.
 * When the input field is not empty, the lock icon is hidden, and the password icon is shown.
 * When the input field is empty, the lock icon is shown, and the password icon is hidden.
 * 
 * @param {HTMLInputElement} inputField - The input field being monitored for changes.
 */
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

/**
 * Toggles the visibility of the password input field by switching between 
 * "text" and "password" input types. Updates the icon's class to reflect the visibility state.
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {HTMLElement} icon - The icon element indicating the visibility state of the password.
 */
function togglePasswordVisibility(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    const isPasswordVisible = passwordInput.type === 'text';
    
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    icon.classList.toggle('password-visible', !isPasswordVisible);
}

/**
 * Handles the login process by validating the user's credentials, storing their session data,
 * and redirecting them to the summary page if successful. Alerts the user if the credentials are invalid.
 * 
 * @param {Event} event - The event object from the login form submission.
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
        const userToSave = { 
            firstname: userFound.firstName, 
            lastname: userFound.lastName 
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userToSave));
        sessionStorage.setItem('loggedInUser', JSON.stringify(userToSave));

        window.location.href = 'summary.html';
    } else {
        alert('Falscher Benutzername oder Passwort');
    }
}

/**
 * Initializes the login page with a transition effect by displaying the login form and adjusting the UI elements.
 * Moves the logo to the corner, displays the login form, and toggles the visibility of logos and containers.
 */
function initialize() {
    

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

    loginPage();
}