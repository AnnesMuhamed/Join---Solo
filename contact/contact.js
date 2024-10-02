document.addEventListener('DOMContentLoaded', function() {
	onloadFunction()
});


let alphabetSections = [];
const colors = [
    '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B',
    '#1FD7C1', '#462F8A', '#FF4646', '#00BEE8'
];

async function onloadFunction() {
    await renderContacts();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let element of includeElements) {
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        element.innerHTML = resp.ok ? await resp.text() : "Page not found";
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

    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
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
        let color = colors[i % colors.length];
        alphabetSections.push(`
            <div class="contact-item" data-id="${contact.id}" data-first-name="${contact.firstName}" data-last-name="${contact.lastName}" data-username="${contact.username}" data-phone="${contact.phone}" data-color="${color}" onclick="highlightContact(this); contactPopUp('${contact.id}', '${contact.firstName}', '${contact.lastName}', '${contact.username}', '${contact.phone}', '${color}')">
                <div class="initials-container" style="background-color: ${color};">${getInitials(contact.firstName, contact.lastName)}</div>
                <div class="contact-info-item">
                    <div class="contact-info">
                        <div class="contact-names">${contact.firstName} ${contact.lastName}</div>
                        <div class="contact-email">${contact.username}</div>
                    </div>
                </div>
            </div>
        `);
    }

    contactSection.innerHTML = `
        <div class="addButton-container">
            <button id="addContactButton" onclick="openContactForm()" class="add-contact-button">
                <span class="button-text">Add a new contact</span>
                <img src="../img/person_add.png" alt="Add Icon" class="button-icon">
            </button>
        </div>
        <div class="contact-list-container">
            ${alphabetSections.join('')}
        </div>
    `;
}

function getInitials(firstName, lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

function highlightContact(element) {
    let contactInfoItem = element.querySelector('.contact-info-item');
    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('highlighted'));
    document.querySelectorAll('.contact-info-item').forEach(item => item.classList.remove('highlighted'));
    element.classList.add('highlighted');
    contactInfoItem.classList.add('highlighted');
    document.getElementById('popup-section').classList.add('show');
    document.getElementById('popup-section').classList.remove('show');
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

    updatePopUpDetails(firstName, lastName, email, phone);
}

function updatePopUpDetails(firstName, lastName, email, phone) {
    const popUpSection = document.getElementById('popup-section');
    popUpSection.querySelector('.popup-initiale').textContent = getInitials(firstName, lastName);
    popUpSection.querySelector('.popup-name').textContent = `${firstName} ${lastName}`;
    popUpSection.querySelector('.popup-email-span').textContent = email;
    popUpSection.querySelector('.popup-phoneNr-span').textContent = phone;
}

function contactPopUp(id, firstName, lastName, email, phone, color) {
    const popUpSection = document.getElementById('popup-section');
    popUpSection.innerHTML = `
        <div class="popup-container">
            <div class="first-container">
                <div class="popup-initiale-container">
                    <div class="initiale-circle" style="background-color: ${color};">
                        <span class="popup-initiale">${getInitials(firstName, lastName)}</span>
                    </div>
                </div>
                <div class="button-name-container">
                    <span class="popup-name">${firstName} ${lastName}</span>
                    <div class="overlay-popup-container">
                        <div class="popup-button-container" id="popup-button">
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
    setEditFormValues(id, firstName, lastName, email, phone);
    popUpSection.classList.add('show');
    movePopupToPosition(popUpSection);


    if (window.innerWidth <= 640) {
        document.getElementById('contactSection').style.display = 'none';
    }

    const popUpElement = document.querySelector('.pop-up');
    if (popUpElement) {
        popUpElement.classList.add('show');
    } else {
        console.error("Popup-Element '.pop-up' nicht gefunden.");
    }
}


function closeContactPopUp() {
    document.getElementById('contactSection').style.display = 'block';
    document.getElementById('popup-section').parentNode.querySelector('.pop-up').classList.remove('show');
}


function setEditFormValues(id, firstName, lastName, email, phone) {
    document.getElementById('editContactId').value = id;
    document.getElementById('editName').value = `${firstName} ${lastName}`;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
}

function movePopupToPosition(popupElement) {
    // Diese Funktion kann angepasst werden, um das Popup zu position
}

function openContactForm() {
    openForm('addContact');
}

function closeContactForm() {
    closeForm('addContact');
}

function openEditContact(id, firstName, lastName, email, phone, color) {
    openForm('editContact');
    setEditFormValues(id, firstName, lastName, email, phone);
    document.getElementById('editFormInitials').textContent = getInitials(firstName, lastName);
    document.getElementById('personContainer').style.backgroundColor = color;
}

function closeEditForm() {
    closeForm('editContact');
}

function openForm(formId) {
    document.getElementById(formId).classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');
    disableAddContactButton(true);
}

function closeForm(formId) {
    document.getElementById(formId).classList.remove('show');
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    disableAddContactButton(false);
}
  

function disableAddContactButton(disable) {
    const button = document.getElementById('addContactButton');
    button.disabled = disable;
    button.classList.toggle('disabled', disable);
}

async function deleteContact(id) {
    await deleteData(`contacts/${id}`);
    await renderContacts();
    closeContactPopUp();
}

function closeContactPopUp() {
    document.getElementById('popup-section').classList.remove('show');
}

function togglePopupOption() {
    document.getElementById("popup-button").classList.toggle("show");
}

document.addEventListener('DOMContentLoaded', onloadFunction);

