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

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        highlightCurrentPage();
    }, 100);
});

function highlightCurrentPage() {
    const currentPage = window.location.href;

    const buttons = {
        summary: document.getElementById('summary'),
        addTask: document.getElementById('addTask'),
        board: document.getElementById('board'),
        contacts: document.getElementById('contacts'),
        privacyPolicy: document.getElementById('privacyPolicy'),
        legalNotice: document.getElementById('legalNotice')
    };

    if ((buttons.summary && currentPage.endsWith('summary-guest.html')) || currentPage.endsWith('summary-user.html')) {
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


