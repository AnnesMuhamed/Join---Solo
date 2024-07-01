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

function init() {
  includeHTML()
  loadUserData();
}

function loadUserData() {
  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
      user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  }

  if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      document.querySelector('.greet .sofia').textContent = userName;
  } else {
      window.location.href = '/sign-up/sign-up.html';
  }
}

document.addEventListener('DOMContentLoaded', init);

function getInitials(firstName, lastName) {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

// async function displayUserInitials(userID) {
//   try {
//       let user = await loadData(`users/${userID}`);
//       if (user) {
//           let initials = getInitials(user.firstName, user.lastName);
//           document.getElementById('user').innerText = initials;
//       } else {
//           console.error("Benutzer nicht gefunden");
//       }
//   } catch (error) {
//       console.error("Fehler beim Laden der Benutzerdaten:", error);
//   }
// }





