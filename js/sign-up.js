/**
 * An array of predefined color codes that can be used for assigning colors to elements 
 * such as tags, labels, or user avatars.
 */
const predefinedColors = [
    '#6E52FF', '#FF5EB3', '#FF7A00', '#1FD7C1', '#00BEE8', '#9327FF', '#FC71FF',
    '#FFA35E', '#FF745E', '#C3FF2B', '#0038FF', '#FFC701', '#FFBB2B', '#FF4646', '#FFE62B'
];

/**
 * Initializes the sign-up page by rendering the sign-up content.
 */
function initSignUp() {
    signUpInnerHTML();
}

/**
 * Displays a custom alert with a given message, animates it into view, 
 * and hides it after a short duration.
 * 
 * @param {string} message - The message to display in the alert.
 */
function showCustomAlert(message) {
    document.getElementById('alert-message').textContent = message;
    const alertElement = document.getElementById('custom-alert');
    alertElement.style.display = 'flex';
    alertElement.style.animation = 'slide-up 0.5s forwards';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

/**
 * Sets the inner HTML of the sign-up section to render the sign-up page template.
 */
function signUpInnerHTML() {
    const signUp = document.getElementById('sectionSignUp');
    signUp.innerHTML = generateSignUpPageTemplate();
}

/**
 * Toggles the visibility of the password field based on the state of the checkbox.
 * When the checkbox is checked, the password is visible (input type 'text').
 * When unchecked, the password is hidden (input type 'password').
 * 
 * @param {string} inputId - The ID of the password input field.
 * @param {string} checkboxId - The ID of the checkbox element.
 */
function togglePassword(inputId, checkboxId) {
    const passwordField = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);

    passwordField.type = checkbox.checked ? 'text' : 'password';
}

/**
 * Handles the sign-up process by validating the user's input, checking if the passwords match, 
 * creating the user, and showing a success or error message. 
 * Redirects the user to the login page after a successful sign-up.
 * 
 * @param {Event} event - The event object from the sign-up form submission.
 */
async function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('first-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (password !== confirmPassword) {
        showCustomAlert("Passwords do not match");
        return;
    }

    const [firstName, ...lastnameParts] = name.split(' ');
    const lastName = lastnameParts.join(' ');

    if (!lastName) {
        showCustomAlert('Please enter both first and last name');
        return;
    }

    const randomColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)];

    await createUser(firstName, lastName, email, password, randomColor);
    showCustomAlert("You signed up successfully");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

/**
 * Creates a new user by sending the user's data to both the 'user' and 'contacts' endpoints.
 * 
 * @param {string} firstName - The first name of the new user.
 * @param {string} lastName - The last name of the new user.
 * @param {string} email - The email (username) of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} color - A random color assigned to the new user.
 */
async function createUser(firstName, lastName, email, password, color) {
    const newUser = { firstName, lastName, username: email, password, color };
    await postData('user', newUser);
    await postData('contacts', newUser);
}