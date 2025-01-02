const predefinedColors = [
    '#6E52FF', '#FF5EB3', '#FF7A00', '#1FD7C1', '#00BEE8', '#9327FF', '#FC71FF',
    '#FFA35E', '#FF745E', '#C3FF2B', '#0038FF', '#FFC701', '#FFBB2B', '#FF4646', '#FFE62B'
];

function initSignUp() {
    signUpInnerHTML();
}

function showCustomAlert(message) {
    document.getElementById('alert-message').textContent = message;
    const alertElement = document.getElementById('custom-alert');
    alertElement.style.display = 'flex';
    alertElement.style.animation = 'slide-up 0.5s forwards';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

function signUpInnerHTML() {
    const signUp = document.getElementById('sectionSignUp');
    signUp.innerHTML = generateSignUpPageTemplate();
}

function togglePassword(inputId, checkboxId) {
    const passwordField = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);

    passwordField.type = checkbox.checked ? 'text' : 'password';
}

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

async function createUser(firstName, lastName, email, password, color) {
    const newUser = { firstName, lastName, username: email, password, color };
    await postData('user', newUser);
    await postData('contacts', newUser);
}
