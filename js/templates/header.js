/**
 * Initializes the page by loading the header content, user data, and dropdown functionality once the DOM is fully loaded.
 * Also highlights the current page in the navigation bar.
 * Handles any errors that occur during the loading process.
 */
document.addEventListener('DOMContentLoaded', () => {
    includeHTML()
        .then(() => loadUserData())
        .then(() => setUpDropdown())
        .catch((error) => console.error('Fehler beim Laden des Headers:', error));

    highlightCurrentPage();
});

/**
 * Loads external HTML content into the page based on the "w3-include-html" attribute of elements.
 * It fetches the content of each file specified in the attribute, inserts it into the corresponding element,
 * and ensures all content is loaded before resolving the promise.
 * In case of an error, it sets the inner HTML of the element to an error message.
 */
function includeHTML() {
    return new Promise((resolve, reject) => {
        const includeElements = document.querySelectorAll("[w3-include-html]");
        let loadedCount = 0;
        const totalElements = includeElements.length;

        includeElements.forEach(element => {
            const file = element.getAttribute("w3-include-html");
            if (file) {
                fetch(file)
                    .then(response => {
                        if (!response.ok) throw new Error('Page not found');
                        return response.text();
                    })
                    .then(text => {
                        element.innerHTML = text;
                        loadedCount++;
                        if (loadedCount === totalElements) {
                            resolve();
                        }
                    })
                    .catch(err => {
                        element.innerHTML = "Error loading content.";
                        reject(err);
                    });
            }
        });
    });
}

/**
 * Toggles the visibility of the dropdown menu by adding or removing the "show" class.
 * This function is used to show or hide the dropdown menu when triggered.
 */
function toggleDropdown() {
    document.getElementById("user-dropdown").classList.toggle("show");
}

/**
 * Sets up the event listener for the user element, triggering the dropdown toggle on click.
 * If the user element is not found, it logs an error to the console.
 */
function setUpDropdown() {
    const userElement = document.getElementById("user");

    if (userElement) {
        userElement.addEventListener('click', toggleDropdown);
    } else {
        console.error("Das Benutzer-Element '#user' wurde nicht gefunden.");
    }
}

/**
 * Displays the initials of the user (first letter of first and last name) in the specified element.
 * If the first and last name are available, the initials are displayed; otherwise, an error is logged.
 * 
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
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
 * Loads the user data from localStorage or sessionStorage and displays the user's initials.
 * If a user is found, it calls the function to display the initials. Otherwise, an error message is logged.
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