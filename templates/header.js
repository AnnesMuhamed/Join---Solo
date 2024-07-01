const BASE_URL = "https://join-232-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

function getInitials(firstName, lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

async function displayUserInitials(userID) {
    try {
        let user = await loadData(`users/${userID}`);
        if (user) {
            let initials = getInitials(user.firstName, user.lastName);
            document.querySelector('.header-right .user').innerText = initials;
        } else {
            console.error("Benutzer nicht gefunden");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
}

function toggleDropdown() {
    document.getElementById("user-dropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
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

displayUserInitials('user123');
