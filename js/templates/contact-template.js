function generateSeparatorTemplate() {
    return `<div class="separator"></div>`;
}
  
function generateAlphabetContainerTemplate(letter) {
    return `
        <div class="alphabet-container">
        <span>${letter}</span>
        </div>
    `;
}
  
function generateContactItemTemplate(contact) {
    return `
        <div class="contact-item" data-id="${contact.id}" data-first-name="${contact.firstName}" 
            data-last-name="${contact.lastName}" data-username="${contact.username}" 
            data-phone="${contact.phone}" data-color="${contact.color}" 
            onclick="highlightContact(this); contactPopUp('${contact.id}', '${contact.firstName}', '${contact.lastName}', '${contact.username}', '${contact.phone}', '${contact.color}')">
        <div class="initials-container" style="background-color: ${contact.color};">
            ${getInitials(contact.firstName, contact.lastName)}
        </div>
        <div class="contact-info-item">
            <div class="contact-info">
            <div class="contact-names">${contact.firstName} ${contact.lastName}</div>
            <div class="contact-email">${contact.username}</div>
            </div>
        </div>
        </div>
    `;
}
  
function generateAddContactButtonTemplate() {
    return `
      <div class="addButton-container">
        <button type="button" id="addContactButton" onclick="openContactForm()" class="add-contact-button">
          <span class="button-text">Add a new contact</span>
          <img src="assets/img/person_add.png" alt="Add Icon" class="button-icon">
        </button>
      </div>
    `;
}

function generateContactPopUpTemplate(id, firstName, lastName, email, phone, color) {
  return `
    <div class="popup-container">
      <div class="first-container">
        <div class="popup-initiale-container">
          <div class="initiale-circle" style="background-color: ${color};">
            <span class="popup-initiale">${getInitials(firstName, lastName)}</span>
          </div>
        </div>

        <div class="button-name-container">
          <span class="popup-name">${firstName} ${lastName}</span>
          <div class="popup-option-container">
            <div id="popup-option" class="option" onclick="togglePopupOption()">
              <img class="option-point-img" src="assets/img/optionpoint.png" alt="">
            </div>
            <div class="overlay-popup-container">
            <div class="popup-button-container" id="popup-button">
              <button type="button" class="popup-buttons" onclick="openEditContact('${id}', '${firstName}', '${lastName}', '${email}', '${phone}')">
                <img class="edit-icon" src="assets/img/edit-black.png" alt="">
                <span class="edit">Edit</span>
              </button>
              <button type="button" class="popup-buttons" onclick="deleteContact('${id}')">
                <img class="delete-icon" src="assets/img/delete.png" alt="">
                <span class="delete">Delete</span>
              </button>
            </div>
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
}