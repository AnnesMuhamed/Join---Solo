/**
 * Lädt externe HTML-Dateien für Header und Sidebar dynamisch in die aktuelle Seite.
 * Ruft nach dem Laden die Initialen-Anzeige und Dropdown-Funktion auf.
 */
function loadExternalHTML() {
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Header konnte nicht geladen werden");
            }
            return response.text();
        })
        .then(html => {
            document.querySelector("header").innerHTML = html;

            setTimeout(() => {
                setUpDropdown();
                loadUserData(); 
            }, 50);
        })
        .catch(error => console.error("Fehler beim Laden des Headers:", error));

    fetch("sidebar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Sidebar konnte nicht geladen werden");
            }
            return response.text();
        })
        .then(html => {
            document.querySelector("aside").innerHTML = html;
        })
        .catch(error => console.error("Fehler beim Laden der Sidebar:", error));
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
 * Aktiviert das Dropdown-Menü für den Benutzer.
 * Stellt sicher, dass Klicks außerhalb das Menü schließen.
 */
function setUpDropdown() {
    setTimeout(() => {
        const userElement = document.getElementById("user");
        const dropdownMenu = document.getElementById("user-dropdown");

        if (userElement && dropdownMenu) {
            userElement.removeEventListener('click', toggleDropdown);
            document.removeEventListener('click', closeDropdown);

            // Dropdown öffnen/schließen
            userElement.addEventListener('click', function (event) {
                event.stopPropagation();
                dropdownMenu.classList.toggle("show");
            });

            document.addEventListener("click", function (event) {
                if (!dropdownMenu.contains(event.target) && !userElement.contains(event.target)) {
                    dropdownMenu.classList.remove("show");
                }
            });

            console.log("Dropdown setup completed.");
        } else {
            console.error("Dropdown-Menü oder Benutzer-Element nicht gefunden.");
        }
    }, 100);
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