function init() {
    let signUp = document.getElementById('sectionSignUp');

    signUp.innerHTML = `
    <div class="logo-container">
        <img src="/img/logo.png" alt="Logo" class="main-logo">
    </div>

    <div class="container">
        <div class="header-container">
        <a href="login.html">    
        <img src="/img/arrow-left-line.png" alt="Zurück" class="back-arrow" onclick="href=login.html">
        </a>
            <div class="header">
                Sign Up
            </div>
        </div>
        <div class="divider"></div>
        <form class="form">
            <label class="input-container">
                <input type="text" id="name" placeholder="Name" minlength="2" required>
                <img src="/img/person.png" alt="Name Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                <img src="/img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" placeholder="Password" minlength="4" required>
                <img src="/img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="confirm-password" placeholder="Confirm Password" minlength="4" required>
                <img src="/img/lock.png" alt="Password Icon" class="input-icon">
            </label>
            <div class="checkbox-container">
                <input type="checkbox" id="accept-policy" required>
                <label for="accept-policy">I accept the <a href="#" class="privacy-policy">Privacy policy</a></label>
            </div>
            <button type="submit" class="sign-up-button">Sign Up</button>
        </form>
    </div>
    <div class="link-container">
        <a class="policy-notice" href="#">Privacy Policy</a>
        <a class="policy-notice" href="#">Legal notice</a>
    </div>
    `;
}