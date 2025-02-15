/**
 * Initializes the contact page by calling the onload function.
 */
function initContact() {
    onloadFunction();
}

/**
 * Executes the onload functionality, rendering the contacts asynchronously.
 */
async function onloadFunction() {
    await renderContacts();
}

/**
 * Includes external HTML content into elements marked with the "w3-include-html" attribute.
 * Fetches the content from the specified file and inserts it into the innerHTML of the element.
 * Displays "Page not found" if the fetch request fails.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let element of includeElements) {
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        element.innerHTML = resp.ok ? await resp.text() : "Page not found";
    }
}

/**
 * Renders the contacts list by fetching, filtering, sorting, and categorizing contacts alphabetically.
 * Generates HTML templates for each contact and its respective alphabet section.
 * Populates the contact section in the DOM with the rendered content.
 */
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

/**
 * Generates the initials from the first and last name by taking the first character of each,
 * converting them to uppercase, and concatenating them.
 * 
 * @param {string} firstName - The first name of the person.
 * @param {string} lastName - The last name of the person.
 * @returns {string} The initials in uppercase.
 */
function getInitials(firstName, lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

/**
 * Highlights the selected contact by adding a 'highlighted' class to the contact element and its info item.
 * Removes the 'highlighted' class from all other contact items and their info items.
 * Toggles the visibility of the popup section by adding and removing the 'show' class.
 * 
 * @param {HTMLElement} element - The DOM element representing the contact to highlight.
 */
function highlightContact(element) {
    let contactInfoItem = element.querySelector('.contact-info-item');
    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('highlighted'));
    document.querySelectorAll('.contact-info-item').forEach(item => item.classList.remove('highlighted'));
    element.classList.add('highlighted');
    contactInfoItem.classList.add('highlighted');
    document.getElementById('popup-section').classList.add('show');
    document.getElementById('popup-section').classList.remove('show');
}

/**
 * Creates a new contact by validating input fields, constructing a contact object,
 * and sending it to the server. Renders the updated contact list and closes the contact form.
 * Ensures all required fields are filled before submission.
 * Clears input fields when reopening the form.
 * 
 * @async
 */
async function createContact() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (!nameInput.checkValidity() || !emailInput.checkValidity() || !phoneInput.checkValidity()) {
        return; 
    }

    const nameParts = nameInput.value.trim().split(' ');
    if (nameParts.length < 2) {
        nameInput.setCustomValidity('Bitte geben Sie Vor- und Nachnamen ein.');
        nameInput.reportValidity();
        return;
    }

    nameInput.setCustomValidity(''); 

    const [firstName, lastName] = nameParts;
    const newContact = { firstName, lastName, username: emailInput.value.trim(), phone: phoneInput.value.trim() };

    await postData('contacts', newContact);
    await renderContacts();
    closeContactForm();
}

/**
 * Clears all input fields in the contact form when reopened.
 */
function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}

/**
 * Saves changes to an existing contact by validating input fields, constructing an updated contact object,
 * and sending it to the server. Updates the contact list, closes the edit form, and updates the popup details.
 * 
 * @async
 */
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

/**
 * Updates the popup section with the provided contact details, including initials, name, email, and phone number.
 * 
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function updatePopUpDetails(firstName, lastName, email, phone) {
    const popUpSection = document.getElementById('popup-section');
    popUpSection.querySelector('.popup-initiale').textContent = getInitials(firstName, lastName);
    popUpSection.querySelector('.popup-name').textContent = `${firstName} ${lastName}`;
    popUpSection.querySelector('.popup-email-span').textContent = email;
    popUpSection.querySelector('.popup-phoneNr-span').textContent = phone;
}

/**
 * Displays the contact popup by populating it with the provided contact details,
 * setting the edit form values, and making the popup visible. Adjusts the layout for small screens.
 * 
 * @param {string} id - The ID of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The color associated with the contact.
 */
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

/**
 * Closes the contact popup by restoring the visibility of the contact section
 * and removing the 'show' class from the popup element.
 */
function closeContactPopUp() {
    document.getElementById('contactSection').style.display = 'block';
    document.getElementById('popup-section').parentNode.querySelector('.pop-up').classList.remove('show');
}


/**
 * Sets the values of the edit form fields with the provided contact details.
 * 
 * @param {string} id - The ID of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function setEditFormValues(id, firstName, lastName, email, phone) {
    document.getElementById('editContactId').value = id;
    document.getElementById('editName').value = `${firstName} ${lastName}`;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
}

/**
 * Opens the form for adding a new contact by invoking the openForm function with the 'addContact' identifier.
 */
function openContactForm() {
    openForm('addContact');
}

/**
 * Closes the form for adding a new contact by invoking the closeForm function with the 'addContact' identifier.
 */
function closeContactForm() {
    closeForm('addContact');
    clearInputFields();
}

/**
 * Opens the form for editing a contact by invoking the openForm function with the 'editContact' identifier.
 * Sets the edit form values, updates the displayed initials, and sets the background color for the contact container.
 * 
 * @param {string} id - The ID of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The color associated with the contact.
 */
function openEditContact(id, firstName, lastName, email, phone, color) {
    openForm('editContact');
    setEditFormValues(id, firstName, lastName, email, phone);
    document.getElementById('editFormInitials').textContent = getInitials(firstName, lastName);
    document.getElementById('personContainer').style.backgroundColor = color;
}

/**
 * Closes the edit contact form by invoking the closeForm function with the 'editContact' identifier.
 */
function closeEditForm() {
    closeForm('editContact');
}

/**
 * Opens a form specified by its ID, displays the overlay, adds a modal-open class to the body,
 * and disables the add contact button.
 * 
 * @param {string} formId - The ID of the form to open.
 */
function openForm(formId) {
    document.getElementById(formId).classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');
    disableAddContactButton(true);
}

/**
 * Closes a form specified by its ID, hides the overlay, removes the modal-open class from the body,
 * and enables the add contact button.
 * 
 * @param {string} formId - The ID of the form to close.
 */
function closeForm(formId) {
    document.getElementById(formId).classList.remove('show');
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    disableAddContactButton(false);
}  

/**
 * Enables or disables the "Add Contact" button and toggles the 'disabled' class based on the provided state.
 * 
 * @param {boolean} disable - Indicates whether to disable (true) or enable (false) the button.
 */
function disableAddContactButton(disable) {
    const button = document.getElementById('addContactButton');
    button.disabled = disable;
    button.classList.toggle('disabled', disable);
}

/**
 * Deletes a contact by its ID, updates the contact list, and closes the contact popup.
 * 
 * @async
 * @param {string} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
    await deleteData(`contacts/${id}`);
    await renderContacts();
    closeContactPopUp();
}

/**
 * Closes the contact popup by removing the 'show' class from the popup section.
 */
function closeContactPopUp() {
    document.getElementById('popup-section').classList.remove('show');
}

/**
 * Toggles the visibility of the popup options menu by adding or removing the 'show' class.
 */
function togglePopupOption() {
    document.getElementById("popup-button").classList.toggle("show");
}