function generateSignUpPageTemplate() {
    return /*html*/ `
      <div class="logo-container">
          <img src="./assets/img/loginLogo.png" alt="Logo" class="main-logo">
      </div>
  
      <div class="signup-container">
          <div class="form-container">
              <div class="header-container">
                  <a href="../index.html">    
                      <img src="./assets/img/arrow-left-line.png" alt="Zurück" class="back-arrow">
                  </a>
                  <div class="header">Sign Up</div>
                  <div class="divider"></div>
              </div>
              
              <form id="sign-up-form" class="form" onsubmit="handleSignUp(event)">
                  <label class="input-container">
                      <input type="text" id="first-name" placeholder="First Name Last Name" minlength="2" required>
                      <img src="./assets/img/gray-person.png" alt="Name Icon" class="input-icon">
                  </label>
                  <label class="input-container">
                      <input type="email" id="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" required>
                      <img src="./assets/img/mail.png" alt="Email Icon" class="input-icon">
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
          <a class="policy-notice" href="./privacy-policy.html">Privacy Policy</a>
          <a class="policy-notice" href="./legal-notice.html">Legal notice</a>
      </div>
    `;
  }