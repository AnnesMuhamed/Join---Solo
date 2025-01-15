function generateLoginPageTemplate() {
    return /*html*/ `
      <div id="overlay" class="overlay">
          <div id="logo-container">
              <img class="dark-logo" src="./assets/img/loginLogo.png" alt="Logo" id="main-logo-dark">
              <img class="white-logo" src="./assets/img/login-logo-rp.png" alt="Logo" id="main-logo-white">
          </div>
      </div>
      <div id="login-page" class="hidden">
          <div class="login-headline-container">
              <h1 class="login-headline">Log in</h1>
              <img class="blue-line" src="./assets/img/Vector 5.png" alt="">
          </div>

          <form id="login-form" onsubmit="handleLogin(event)">
            <label class="input-container">
                <input type="email" id="username" minlength="9" placeholder="Email" required oninput="validateInputs()">
                <img src="./assets/img/mail.png" alt="Email Icon" class="input-icon">
            </label>
            <label class="input-container">
                <input type="password" id="password" placeholder="Password" minlength="4" required oninput="toggleIconOnInput(this)">
                <span class="lock-icon"></span>
                <span class="password-icon hidden" onclick="togglePasswordVisibility('password', this)"></span>
            </label>
            <label class="option" for="option">
                <input type="checkbox" name="option" id="option" class="custom-checkbox">
                <span class="checkbox-custom"></span> Remember me
            </label>

            <div class="button-container">
                <button type="submit" class="login-button" disabled>Log in</button>
                <a href="summary.html">
                    <button type="button" class="guest-button">Guest Log in</button>
                </a>
            </div>
        </form>

      </div>
      <div class="signup-container hidden">
          <span class="not-a-user">Not a Join user?</span>
          <a href="sign-up.html"><button class="signup-button">Sign up</button></a>
      </div>
      <div class="link-container hidden">
          <a class="policy-notice" href="privacy-policy.html">Privacy Policy</a>
          <a class="policy-notice" href="legal-notice.html">Legal notice</a>
      </div>
    `;
}