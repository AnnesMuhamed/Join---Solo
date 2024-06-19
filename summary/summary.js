'use strict';
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
      user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  }

  if (user) {
      document.querySelector('.greet .sofia').textContent = user.username;
  } else {
      // Kein Benutzer eingeloggt: leite zur Login-Seite weiter
      window.location.href = '/login/login.html'; // Passe den Pfad an, falls erforderlich
  }
});
