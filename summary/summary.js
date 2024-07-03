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
  includeHTML().then(loadUserData);
}

function loadUserData() {
  let user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
      user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  }

  if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      document.querySelector('.greet .sofia').textContent = userName;
      displayUserInitials(user.firstName, user.lastName);
  } else {
      window.location.href = '/sign-up/sign-up.html';
  }
}

function getInitials(firstName, lastName) {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

function displayUserInitials(firstName, lastName) {
  const initials = getInitials(firstName, lastName);
  const userDiv = document.getElementById('user');
  userDiv.textContent = initials;
}

document.addEventListener('DOMContentLoaded', init);


