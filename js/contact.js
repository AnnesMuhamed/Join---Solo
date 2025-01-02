function initContact() {
    onloadFunction()
}

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
    contactsArray = contactsArray.filter(contact => contact && contact.firstName);
    contactsArray.sort((a, b) => a.firstName.localeCompare(b.firstName));
  
    let alphabetSections = [];
  
    for (let contact of contactsArray) {
      let firstLetter = contact.firstName.charAt(0).toUpperCase();
      
      if (firstLetter !== currentLetter) {
        if (currentLetter !== '') {
          alphabetSections.push(generateSeparatorTemplate());
        }
        currentLetter = firstLetter;
        alphabetSections.push(generateAlphabetContainerTemplate(currentLetter));
      }
      alphabetSections.push(generateContactItemTemplate(contact));
    }
  
    contactSection.innerHTML = `
      ${generateAddContactButtonTemplate()}
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
    popUpSection.innerHTML = generateContactPopUpTemplate(id, firstName, lastName, email, phone, color);
    setEditFormValues(id, firstName, lastName, email, phone);
    popUpSection.classList.add('show');
  
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

