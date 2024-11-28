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
    signUp.innerHTML = `
    <div class="logo-container">
        <img src="../assets/img/loginLogo.png" alt="Logo" class="main-logo">
    </div>

    <div class="signup-container">
        <div class="form-container">
            <div class="header-container">
                <a href="../index.html">    
                    <img src="../assets/img/arrow-left-line.png" alt="Zurück" class="back-arrow">
                </a>
                <div class="header">Sign Up</div>
                <div class="divider">
                </div>
            </div>
            
            <form id="sign-up-form" class="form" onsubmit="handleSignUp(event)">
                <label class="input-container">
                    <input type="text" id="first-name" placeholder="First Name Last Name" minlength="2" required>
                    <img src="../assets/img/gray-person.png" alt="Name Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                    <img src="../assets/img/mail.png" alt="Email Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="password" id="password" placeholder="Password" minlength="4" required>
                    <input type="checkbox" id="toggle-password" class="toggle-password-checkbox" onchange="togglePassword('password', 'toggle-password')">
                    <label for="toggle-password" class="password-icon"></label>
                </label>
                <label class="input-container">
                    <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
                    <input type="checkbox" id="toggle-confirm-password" class="toggle-password-checkbox" onchange="togglePassword('confirm-password', 'toggle-confirm-password')">
                    <label for="toggle-confirm-password" class="password-icon"></label>
                </label>
                <div class="checkbox-container">
                    <input type="checkbox" id="accept-policy" class="custom-checkbox" required>
                    <label for="accept-policy">
                        <span class="checkbox-custom"></span>
                        I accept the <a href="privacy-policy.html" class="privacy-policy">Privacy policy</a>
                    </label>
                </div>
                <button type="submit" class="sign-up-button">Sign Up</button>
            </form>
        </div>
    </div>
    <div class="link-container">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    </div>
    `;
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
