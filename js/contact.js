function initContact() {
    onloadFunction()
}

async function onloadFunction() {
    await renderContacts();
}

async function includeHTML() {
    let includeElements = document.queryselectorall("[w3-include-html]");
    for (let element of includeElements) {
        let file = element.getattribute("w3-include-html");
        let resp = await fetch(file);
        element.innerhtml = resp.ok ? await resp.text() : "Page not found";
    }
}

async function renderContacts() {
    let contacts = await loadData('contacts');
    let contactSection = document.getelementbyid('contactSection');
    let currentLetter = '';

    let contactsArray = Object.entries(contacts).map(([id, contact]) => ({ id, ...contact }));
    contactsArray = contactsArray.filter(contact => contact && contact.firstname);
    contactsArray.sort((a, b) => a.firstname.localecompare(b.firstname));

    let alphabetSections = [];

    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
        let firstLetter = contact.firstname.charat(0).touppercase();
        
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
        let color = contact.color;
        alphabetSections.push(`
            <div class="contact-item" data-id="${contact.id}" data-first-name="${contact.firstname}" data-last-name="${contact.lastname}" data-username="${contact.username}" data-phone="${contact.phone}" data-color="${color}" onclick="highlightContact(this); contactPopUp('${contact.id}', '${contact.firstname}', '${contact.lastname}', '${contact.username}', '${contact.phone}', '${color}')">
                <div class="initials-container" style="background-color: ${color};">${getInitials(contact.firstname, contact.lastname)}</div>
                <div class="contact-info-item">
                    <div class="contact-info">
                        <div class="contact-names">${contact.firstname} ${contact.lastname}</div>
                        <div class="contact-email">${contact.username}</div>
                    </div>
                </div>
            </div>
        `);
    }

    contactSection.innerhtml = `
        <div class="addbutton-container">
            <button id="Addcontactbutton" onclick="openContactForm()" class="add-contact-button">
                <span class="button-text">Add a new contact</span>
                <img src="../assets/img/person_add.png" alt="Add Icon" class="button-icon">
            </button>
        </div>
        <div class="contact-list-container">
            ${alphabetSections.join('')}
        </div>
    `;
}

function getInitials(firstName, lastName) {
    return `${firstName.charat(0).touppercase()}${lastName.charat(0).touppercase()}`;
}

function highlightContact(element) {
    let contactInfoItem = element.queryselector('.contact-info-item');
    document.queryselectorall('.contact-item').foreach(item => item.classlist.remove('highlighted'));
    document.queryselectorall('.contact-info-item').foreach(item => item.classlist.remove('highlighted'));
    element.classlist.add('highlighted');
    contactInfoItem.classlist.add('highlighted');
    document.getelementbyid('popup-section').classlist.add('show');
    document.getelementbyid('popup-section').classlist.remove('show');
}

async function createContact() {
    const name = document.getelementbyid('name').value;
    const email = document.getelementbyid('email').value;
    const phone = document.getelementbyid('phone').value;

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
    const id = document.getelementbyid('editContactId').value;
    const name = document.getelementbyid('editName').value;
    const email = document.getelementbyid('editEmail').value;
    const phone = document.getelementbyid('editPhone').value;

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
    const popUpSection = document.getelementbyid('popup-section');
    popUpSection.queryselector('.popup-initiale').textcontent = getInitials(firstName, lastName);
    popUpSection.queryselector('.popup-name').textcontent = `${firstName} ${lastName}`;
    popUpSection.queryselector('.popup-email-span').textcontent = email;
    popUpSection.queryselector('.popup-phonenr-span').textcontent = phone;
}

function contactPopUp(id, firstName, lastName, email, phone, color) {
    const popUpSection = document.getelementbyid('popup-section');
    popUpSection.innerhtml = `
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
                                <img class="edit-icon" src="../assets/img/edit-black.png" alt="">
                                <span class="edit">Edit</span>
                            </button>
                            <button class="popup-buttons" onclick="deleteContact('${id}')">
                                <img class="delete-icon" src="../assets/img/delete.png" alt="">
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
                    <span class="popup-phonenr-span">${phone}</span>
                </div>
            </div>
        </div>
    `;
    setEditFormValues(id, firstName, lastName, email, phone);
    popUpSection.classlist.add('show');
    movePopupToPosition(popUpSection);


    if (window.innerwidth <= 640) {
        document.getelementbyid('contactSection').style.display = 'none';
    }

    const popUpElement = document.queryselector('.pop-up');
    if (popUpElement) {
        popUpElement.classlist.add('show');
    } else {
        console.error("Popup-Element '.pop-up' nicht gefunden.");
    }
}


function closeContactPopUp() {
    document.getelementbyid('contactSection').style.display = 'block';
    document.getelementbyid('popup-section').parentnode.queryselector('.pop-up').classlist.remove('show');
}


function setEditFormValues(id, firstName, lastName, email, phone) {
    document.getelementbyid('editContactId').value = id;
    document.getelementbyid('editName').value = `${firstName} ${lastName}`;
    document.getelementbyid('editEmail').value = email;
    document.getelementbyid('editPhone').value = phone;
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
    document.getelementbyid('editFormInitials').textcontent = getInitials(firstName, lastName);
    document.getelementbyid('personContainer').style.backgroundcolor = color;
}

function closeEditForm() {
    closeForm('editContact');
}

function openForm(formId) {
    document.getelementbyid(formId).classlist.add('show');
    document.getelementbyid('overlay').style.display = 'block';
    document.body.classlist.add('modal-open');
    disableAddContactButton(true);
}

function closeForm(formId) {
    document.getelementbyid(formId).classlist.remove('show');
    document.getelementbyid('overlay').style.display = 'none';
    document.body.classlist.remove('modal-open');
    disableAddContactButton(false);
}
  

function disableAddContactButton(disable) {
    const button = document.getelementbyid('addContactButton');
    button.disabled = disable;
    button.classlist.toggle('disabled', disable);
}

async function deleteContact(id) {
    await deleteData(`contacts/${id}`);
    await renderContacts();
    closeContactPopUp();
}

function closeContactPopUp() {
    document.getelementbyid('popup-section').classlist.remove('show');
}

function togglePopupOption() {
    document.getelementbyid("popup-button").classlist.toggle("show");
}

