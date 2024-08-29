document.addEventListener('DOMContentLoaded', () => {
	init();
});


function init() {
  greetUser();
}

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

function greetUser() {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    }

    if (user) {
        const userName = `${user.firstName} ${user.lastName}`;
		let greetUserField = document.querySelector('.gm');
		let greetedUserField = document.querySelector('.sofia');
		greetedUserField.classList.remove('d-none');
        greetUserField.textContent = 'Good morning,';
        greetedUserField.textContent = userName;
    }
}

window.onload = function() {
  if (window.innerWidth <= 780) {
      document.getElementById('sectionGreet').style.display = 'flex';
      document.getElementById('content').style.display = 'none';

      setTimeout(function() {
          document.getElementById('sectionGreet').style.display = 'none';
          document.getElementById('content').style.display = 'block';
      }, 3000);
  } else {
      document.getElementById('sectionGreet').style.display = 'none';
      document.getElementById('content').style.display = 'flex';
  }
}