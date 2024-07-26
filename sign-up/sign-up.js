document.addEventListener('DOMContentLoaded', init);

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

// Funktion zum Anzeigen des benutzerdefinierten Alerts
function showCustomAlert(message) {
    // Setzt die Nachricht des Alerts
    document.getElementById('alert-message').textContent = message;
    // Zeigt den Alert-Container an und startet die Animation
    const alertElement = document.getElementById('custom-alert');
    alertElement.style.display = 'flex';
    alertElement.style.animation = 'slide-up 0.5s forwards 800ms';

    document.getElementById('userStoryCard').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');

    // Versteckt den Alert nach 2000ms automatisch
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

// Funktion zum Anzeigen des benutzerdefinierten Alerts
function showCustomAlert(message) {
    // Setzt die Nachricht des Alerts
    document.getElementById('alert-message').textContent = message;
    // Zeigt den Alert-Container an und startet die Animation
    const alertElement = document.getElementById('custom-alert');
    alertElement.style.display = 'flex';
    alertElement.style.animation = 'slide-up 0.5s forwards, fade-in 0.5s forwards 800ms';

    // Versteckt den Alert nach 2000ms automatisch
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 2000);
}

function init() {
    let signUp = document.getElementById('sectionSignUp');

    signUp.innerHTML = `
    <div class="logo-container">
        <img src="../img/loginLogo.png" alt="Logo" class="main-logo">
    </div>

    <div class="container">
        <div class="header-container">
        <a href="../index.html">    
        <img src="../img/arrow-left-line.png" alt="Zurück" class="back-arrow">
        </a>
            <div class="header">
                Sign Up
            </div>
        </div>
        <div class="divider"></div>
        <form id="sign-up-form" class="form">
            <label class="input-container">
                <input type="text" id="first-name" placeholder="First Name Last Name" minlength="2" required>
                <img src="../img/person.png" alt="Name Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$" required>
                <img src="../img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" placeholder="Password" minlength="4" required>
                <img src="../img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
                <img src="../img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <div class="checkbox-container">
                <input type="checkbox" id="accept-policy" class="checkbox-hover-design" required>
                <label for="accept-policy">I accept the <a href="../privacy-policy/privacy-policy.html" class="privacy-policy checkbox-hover-design">Privacy policy</a></label>
            </div>
            <button type="submit" class="sign-up-button">Sign Up</button>
        </form>
    </div>
    <div class="link-container">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    `;

    const signUpForm = document.getElementById('sign-up-form');
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

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

        await createUser(firstName, lastName, email, password);
        showCustomAlert("You Signed Up successfully");
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    });
}



// function init() {
//     let signUp = document.getElementById('sectionSignUp');

//     signUp.innerHTML = `
//     <div class="logo-container">
//         <img src="../img/loginLogo.png" alt="Logo" class="main-logo">
//     </div>

//     <div class="container">
//         <div class="header-container">
//         <a href="../index.html">    
//         <img src="../img/arrow-left-line.png" alt="Zurück" class="back-arrow">
//         </a>
//             <div class="header">
//                 Sign Up
//             </div>
//         </div>
//         <div class="divider"></div>
//         <form id="sign-up-form" class="form">
//             <label class="input-container">
//                 <input type="text" id="first-name" placeholder="First Name Last Name" minlength="2" required>
//                 <img src="../img/person.png" alt="Name Icon" class="input-icon">
//             </label>
//             <label class="input-container">
//                 <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
//                 <img src="../img/mail.png" alt="Email Icon" class="input-icon">
//             </label>
//             <label class="input-container">
//                 <input type="password" id="password" placeholder="Password" minlength="4" required>
//                 <img src="../img/lock.png" alt="Password Icon" class="input-icon">
//             </label>
//             <label class="input-container">
//                 <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
//                 <img src="../img/lock.png" alt="Password Icon" class="input-icon">
//             </label>
//             <div class="checkbox-container">
//                 <input type="checkbox" id="accept-policy" class="checkbox-hover-design" required>
//                 <label for="accept-policy">I accept the <a href="../privacy-policy/privacy-policy.html" class="privacy-policy checkbox-hover-design">Privacy policy</a></label>
//             </div>
//             <button type="submit" class="sign-up-button">Sign Up</button>
//         </form>
//     </div>
//     <div class="link-container">
//         <a class="policy-notice" href="#">Privacy Policy</a>
//         <a class="policy-notice" href="#">Legal notice</a>
//     </div>
//     `;

//     const signUpForm = document.getElementById('sign-up-form');
//     signUpForm.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const name = document.getElementById('first-name').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const password = document.getElementById('password').value.trim();
//         const confirmPassword = document.getElementById('confirm-password').value.trim();

//         if (password !== confirmPassword) {
//             alert("Passwort stimmit nicht überein");
//             return;
//         }

//         const [firstName, ...lastNameParts] = name.split(' ');
//         const lastName = lastNameParts.join(' ');

//         if (!lastName) {
//             alert('Bitte geben Sie sowohl Vor- als auch Nachnamen ein');
//             return;
//         }

//         await createUser(firstName, lastName, email, password);
//         alert("Benutzer erfolgreich erstellt!");
//         window.location.href = '../index.html';
//     });
// }

async function createUser(firstName, lastName, email, password) {
    const newUser = { firstName, lastName, username: email, password };
    await postData('user', newUser);
    await postData('contacts', newUser);
}

