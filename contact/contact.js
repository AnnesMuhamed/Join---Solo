async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return await response.json();
}

async function updateData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

let alphabetSections = [];

async function onloadFunction() {
    await includeHTML();
    await renderContacts();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

async function renderContacts() {
    let contacts = await loadData('contacts');
    let contactSection = document.getElementById('contactSection');
    let currentLetter = '';

    let contactsArray = Object.entries(contacts).map(([id, contact]) => ({ id, ...contact }));
    contactsArray = contactsArray.filter(contact => contact && contact.lastName);

    contactsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));

    alphabetSections = [];

    contactsArray.forEach((contact, index) => {
        let firstLetter = contact.lastName.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            if (currentLetter !== '') {
                alphabetSections.push(`<div class="separator"></div>`);
            }
            currentLetter = firstLetter;
            alphabetSections.push(`
                <div class="alphabet-container">
                    <span>${currentLetter}</span>
                </div>
            `);
        }
        alphabetSections.push(`
            <div class="contact-item" onclick="highlightContact(this); contactPopUp('${contact.id}', '${contact.firstName}', '${contact.lastName}', '${contact.username}', '${contact.phone}')">
                <div class="initials-container">${getInitials(contact.firstName, contact.lastName)}</div>
                <div class="contact-info-item">
                    <div class="contact-info">
                        <div class="contact-names">${contact.firstName} ${contact.lastName}</div>
                        <div class="contact-email">${contact.username}</div>
                    </div>
                </div>
            </div>
        `);
    });

    contactSection.innerHTML = `
        <button id="addContactButton" onclick="openContactForm()" class="add-contact-button">
            <span class="button-text">Add a new contact</span>
            <img src="../img/person_add.png" alt="Add Icon" class="button-icon">
        </button>
        <div class="contact-list-container">
            ${alphabetSections.join('')}
        </div>
        
    `;
}

function getInitials(firstName, lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

function highlightContact(element) {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.classList.remove('highlighted');
    });
    element.classList.add('highlighted');
}

async function createContact() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!name || !email || !phone) {
        alert('Bitte alle Felder ausfüllen');
        return;
    }

    const [firstName, lastName] = name.split(' ');
    if (!lastName) {
        alert('Bitte geben Sie sowohl Vor- als auch Nachnamen ein');
        return;
    }
    const newContact = { firstName, lastName, username: email, phone };

    await postData('contacts', newContact);
    await renderContacts();
    closeContactForm();
}

async function saveContact() {
    const id = document.getElementById('editContactId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;

    if (!name || !email || !phone) {
        alert('Bitte alle Felder ausfüllen');
        return;
    }

    const [firstName, lastName] = name.split(' ');
    if (!lastName) {
        alert('Bitte geben Sie sowohl Vor- als auch Nachnamen ein');
        return;
    }
    const updateContact = { firstName, lastName, username: email, phone };
    
    await updateData(`contacts/${id}`, updateContact);
    await renderContacts();
    closeEditForm();

    
    const popUpSection = document.getElementById('popup-section');
    const initialsSpan = popUpSection.querySelector('.popup-initiale');
    initialsSpan.textContent = getInitials(firstName, lastName);

    
    const nameSpan = popUpSection.querySelector('.popup-name');
    nameSpan.textContent = `${firstName} ${lastName}`;

    
    const emailSpan = popUpSection.querySelector('.popup-email-span');
    emailSpan.textContent = email;

    const phoneSpan = popUpSection.querySelector('.popup-phoneNr-span');
    phoneSpan.textContent = phone;
}

function contactPopUp(id, firstName, lastName, email, phone) {
    const popUpSection = document.getElementById('popup-section');
    popUpSection.innerHTML = `
        <div class="popup-container">
            <div class="first-container">
                <div class="popup-initiale-container">
                    <div class="initiale-circle">
                        <span class="popup-initiale">${getInitials(firstName, lastName)}</span>
                    </div>
                </div>
                <div class="button-name-container">
                    <span class="popup-name">${firstName} ${lastName}</span>
                    <div class="popup-button-container">
                        <button class="popup-buttons" onclick="openEditContact('${id}', '${firstName}', '${lastName}', '${email}', '${phone}')">
                            <img class="edit-icon" src="../img/edit-black.png" alt="">
                            <span class="edit">Edit</span>
                        </button>
                        <button class="popup-buttons" onclick="deleteContact('${id}')">
                            <img class="delete-icon" src="../img/delete.png" alt="">
                            <span class="delete">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="popup-contact-info">
                <span class="popup-headline">Contact Information</span>
            </div>
            <div class="popup-email-phone">
                <div class="popup-email">
                    <span class="popup-name-span">Email</span>
                    <span class="popup-email-span">${email}</span>
                </div>
                <div class="popup-phone">
                    <span class="popup-phone-span">Phone</span>
                    <span class="popup-phoneNr-span">${phone}</span>
                </div>
            </div>
        </div>
    `;
    document.getElementById('editContactId').value = id;
    document.getElementById('editName').value = `${firstName} ${lastName}`;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
    popUpSection.classList.add('show');
}

function openContactForm() {
    document.getElementById('addContact').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');
    document.getElementById('addContactButton').disabled = true;
    document.getElementById('addContactButton').classList.add('disabled');
    document.querySelector('.header').classList.add('inactive');
    document.querySelector('.sidebar').classList.add('inactive');
}

function closeContactForm() {
    document.getElementById('addContact').classList.remove('show');
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('addContactButton').disabled = false;
    document.getElementById('addContactButton').classList.remove('disabled');
    document.querySelector('.header').classList.remove('inactive');
    document.querySelector('.sidebar').classList.remove('inactive');
}

function openEditContact(id, firstName, lastName, email, phone) {
    document.getElementById('editContact').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');
    document.getElementById('addContactButton').disabled = true;
    document.getElementById('addContactButton').classList.add('disabled');
    document.querySelector('.header').classList.add('inactive');
    document.querySelector('.sidebar').classList.add('inactive');
    
    const initials = getInitials(firstName, lastName);

    document.getElementById('editFormInitials').textContent = initials;
    document.getElementById('editContactId').value = id;
    document.getElementById('editName').value = `${firstName} ${lastName}`;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
}

function closeEditForm() {
    document.getElementById('editContact').classList.remove('show');
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('addContactButton').disabled = false;
    document.getElementById('addContactButton').classList.remove('disabled');
    document.querySelector('.header').classList.remove('inactive');
    document.querySelector('.sidebar').classList.remove('inactive');
}

async function deleteContact(id) {
    await deleteData(`contacts/${id}`);
    await renderContacts();
    closeContactPopUp();
}

function closeContactPopUp() {
    const popUpSection = document.getElementById('popup-section');
    popUpSection.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', onloadFunction);
