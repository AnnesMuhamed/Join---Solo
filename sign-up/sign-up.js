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
    alertElement.style.animation = 'slide-up 0.5s forwards 800ms';

    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

function signUpInnerHTML() {
    let signUp = document.getElementById('sectionSignUp');
    signUp.innerHTML = `
    <div class="logo-container">
        <img src="../img/loginLogo.png" alt="Logo" class="main-logo">
    </div>

    <div class="signup-container">
        <div class="form-container">
            <div class="header-container">
                <a href="../index.html">    
                    <img src="../img/arrow-left-line.png" alt="Zurück" class="back-arrow">
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
                    <img src="../img/person.png" alt="Name Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                    <img src="../img/mail.png" alt="Email Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="password" id="password" placeholder="Password" minlength="4" required>
                    <img src="../img/lock.png" alt="Password Icon" class="input-icon">
                </label>
                <label class="input-container">
                    <input type="password" id="confirm-password" class="signup-password" placeholder="Confirm Password" minlength="4" required>
                    <img src="../img/lock.png" alt="Password Icon" class="input-icon">
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

async function handleSignUp() {
    const name = document.getElementById('first-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (password !== confirmPassword) {
        showCustomAlert("Passwort stimmt nicht überein");
        return;
    }

    const [firstName, ...lastNameParts] = name.split(' ');
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
