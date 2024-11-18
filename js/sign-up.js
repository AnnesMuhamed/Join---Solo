const predefinedColors = [
    '#6E52Ff', '#Ff5Eb3', '#Ff7A00', '#1Fd7C1', '#00Bee8', '#9327Ff', '#Fc71Ff',
    '#Ffa35E', '#Ff745E', '#C3Ff2B', '#0038Ff', '#Ffc701', '#Ffbb2B', '#Ff4646', '#Ffe62B'
];

function initSignUp() {
    signUpInnerHTML();
}

function showCustomAlert(message) {
    document.getelementbyid('alert-message').textcontent = message;
    const alertElement = document.getelementbyid('custom-alert');
    alertElement.style.display = 'flex';
    alertElement.style.animation = 'slide-up 0.5s forwards 800ms';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

function signUpInnerHTML() {
    let signUp = document.getelementbyid('sectionSignUp');
    signUp.innerhtml = `
    <div class="logo-container">
        <img src="../assets/img/loginLogo.png" alt="Logo" class="main-logo">
    </div>

    <div class="signup-container">
        <div class="form-container">
            <div class="header-container">
                <a href="../index.html">    
                    <img src="../assets/img/arrow-left-line.png" alt="Zurück" class="back-arrow">
                </a>
                <div class="header">
                    Sign Up
                </div>
                <div class="divider">
                    <img class="blue-line" src="./img/Vector 5.png" alt="">
                </div>
            </div>
            
            <form id="sign-up-form" class="form" onsubmit="handleSignUp(event)">
                <label class="input-container">
                    <input type="text" id="first-name" placeholder="First Name Last Name" minlength="2" required>
                    <img src="../assets/img/person.png" alt="Name Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="email" id="Email" placeholder="Email" pattern="^[a-zA-Z0-9.-%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                    <img src="../assets/img/mail.png" alt="Email Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="password" id="Password" placeholder="Password" minlength="4" required>
                    <input type="checkbox" id="toggle-password" class="toggle-password-checkbox" onchange="togglePassword('password', 'toggle-password')">
                    <label for="toggle-password" class="password-icon"></label>
                </label>
                <label class="input-container">
                    <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
                    <input type="checkbox" id="toggle-confirm-password" class="toggle-password-checkbox" onchange="togglePassword('confirm-password', 'toggle-confirm-password')">
                    <label for="toggle-confirm-password" class="password-icon"></label>
                </label>
            </form>
            <div class="checkbox-container">
                    <input type="checkbox" id="accept-policy" class="custom-checkbox" required>
                    <label for="accept-policy">
                        <span class="checkbox-custom"></span>
                        I accept the <a href="../privacy-policy/privacy-policy.html" class="privacy-policy">Privacy policy</a>
                    </label>
                </div>
                <button class="sign-up-button" onclick="handleSignUp()">Sign Up</button>
        </div>
    </div>
    <div class="link-container">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    </div>
    `;
}

function togglePassword(inputId, checkboxId) {
    const passwordField = document.getelementbyid(inputId);
    const checkbox = document.getelementbyid(checkboxId);

    passwordField.type = checkbox.checked ? 'text' : 'password';
}

async function handleSignUp() {
    const name = document.getelementbyid('first-name').value.trim();
    const email = document.getelementbyid('email').value.trim();
    const password = document.getelementbyid('password').value.trim();
    const confirmPassword = document.getelementbyid('confirm-password').value.trim();

    if (password !== confirmPassword) {
        showCustomAlert("Passwort stimmt nicht überein");
        return;
    }

    const [firstName, ...lastnameparts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    if (!lastName) {
        showCustomAlert('Bitte geben Sie sowohl Vor- als auch Nachnamen ein');
        return;
    }
    const randomColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)];

    await createUser(firstName, lastName, email, password, randomColor);
    showCustomAlert("You Signed Up successfully");
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
}

async function createUser(firstName, lastName, email, password, color) {
    const newUser = { firstName, lastName, username: email, password, color };
    await postData('user', newUser);
    await postData('contacts', newUser);
}
