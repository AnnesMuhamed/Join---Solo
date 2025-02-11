/**
 * Lädt externe HTML-Dateien für Header und Sidebar dynamisch in die aktuelle Seite.
 * Ruft nach dem Laden die Initialen-Anzeige und Dropdown-Funktion auf.
 */
function loadExternalHTML() {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "login.html" || currentPage === "") {
        return; // Funktion beenden, damit nichts geladen wird
    }

    fetch("header.html")
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(html => {
            const headerElement = document.querySelector("header");
            if (headerElement) {
                headerElement.innerHTML = html;
                setTimeout(() => {
                    loadUserData();
                }, 50);
            }
        })
        .catch(() => { /* Fehler unterdrücken */ });

    fetch("sidebar.html")
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(html => {
            const sidebarElement = document.querySelector("aside");
            if (sidebarElement) {
                sidebarElement.innerHTML = html;
            }
        })
        .catch(() => { /* Fehler unterdrücken */ });
}

document.addEventListener("DOMContentLoaded", loadExternalHTML);

/**
 * Toggles the visibility of the dropdown menu by adding or removing the "show" class.
 * This function is used to show or hide the dropdown menu when triggered.
 */
function toggleDropdown() {
    document.getElementById("user-dropdown").classList.toggle("show");
}

/**
 * Zeigt die Initialen des Users im Header an.
 * 
 * @param {string} firstName - Der Vorname des Users.
 * @param {string} lastName - Der Nachname des Users.
 */
function displayUserInitials(firstName, lastName) {
    const initialsElement = document.getElementById('user');

    if (initialsElement) {
        if (firstName && lastName) {
            const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            initialsElement.textContent = initials;
        } else {
            console.error('Fehler: Kein Vorname oder Nachname gefunden!');
        }
    }
}

/**
 * Lädt den User aus dem Speicher und zeigt die Initialen im Header an.
 */
function loadUserData() {
    let user = JSON.parse(localStorage.getItem('loggedInUser')) || JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (user) {
        displayUserInitials(user.firstname, user.lastname);
    } else {
        console.log('Kein Benutzer gefunden');
    }
}

/**
 * Highlights the current page's corresponding navigation button by adding the "active" class.
 * It checks the current page's URL and matches it with the relevant buttons to highlight.
 * The "active" class is added to the button that matches the current page, and removed from all other buttons.
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const buttons = assignButtons();

    Object.values(buttons).forEach(button => {
        if (button) {
            button.classList.remove('active');
        }
    });

    if ((buttons.summary && currentPage.endsWith('summary.html'))) {
        buttons.summary.classList.add('active');
    } else if (buttons.addTask && currentPage.endsWith('add-task.html')) {
        buttons.addTask.classList.add('active');
    } else if (buttons.board && currentPage.endsWith('board.html')) {
        buttons.board.classList.add('active');
    } else if (buttons.contacts && currentPage.endsWith('contact.html')) {
        buttons.contacts.classList.add('active');
    } else if (buttons.privacyPolicy && currentPage.endsWith('privacy-policy.html')) {
        buttons.privacyPolicy.classList.add('active');
    } else if (buttons.legalNotice && currentPage.endsWith('legal-notice.html')) {
        buttons.legalNotice.classList.add('active');
    }
}

/**
 * Assigns and returns an object containing references to various page navigation buttons.
 * Each button is selected by its corresponding ID, and the object provides access to these elements 
 * for further manipulation, such as adding/removing the "active" class based on the current page.
 * 
 * @returns {Object} - An object containing references to the navigation buttons.
 */
function assignButtons() {
    return {
        summary: document.getElementById('summary'),
        addTask: document.getElementById('addTask'),
        board: document.getElementById('board'),
        contacts: document.getElementById('contacts'),
        privacyPolicy: document.getElementById('privacyPolicy'),
        legalNotice: document.getElementById('legalNotice')
    };
}

/**
 * Clears the user session data stored in both localStorage and sessionStorage.
 * This function is triggered when the user logs out, removing the user's data 
 * and ensuring that the next time the page is loaded, no user information remains.
 */
function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();
}