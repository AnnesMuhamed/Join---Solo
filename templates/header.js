const BASE_URL = "https://join-232-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
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

function toggleDropdown() {
    document.getElementById("user-dropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('#user')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
    
}

