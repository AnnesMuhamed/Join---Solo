"use strict";

let pathContacts = "contacts";
let expanded = false;
let contacts = null;
let selectedContactsSet = new Set();
let assignedContacts = "";

/**
 * Loads contacts asynchronously from the specified path and renders checkboxes with colors 
 * if contacts are successfully retrieved.
 */
async function loadContacts() {
  contacts = await loadData(pathContacts);
  if (contacts) {
    renderCheckboxesWithColors(); 
  }
}

/**
 * Retrieves and returns an array of all contact IDs.
 * 
 * @returns {Array} An array containing the IDs of all contacts.
 */
function getContactsIds() {
  let contactsIds = [];
  for (let id in contacts) {
    contactsIds.push(id);
  }
  return contactsIds;
}

/**
 * Retrieves the initials of a contact based on their first and last name.
 * 
 * @param {string} id - The ID of the contact.
 * @returns {string} The initials of the contact (first letter of first and last name).
 */
function getContactInitials(id) {
  return `${contacts[id]["firstName"].charAt(0)}${contacts[id]["lastName"].charAt(0)}`;
}

/**
 * Handles the assignment and removal of contacts based on checkbox selection.
 * Adds or removes the contact initials span to/from the "assigned-contacts" container,
 * and updates the list of assigned contacts accordingly.
 * 
 * @param {Event} event - The event triggered by the checkbox interaction.
 */
function assignContacts(event) {  
  if (!event.target || event.target.type !== "checkbox") {
    console.error("assignContacts wurde mit einem ungültigen Element aufgerufen");
    return;
  }

  let assignments = document.getElementById("assigned-contacts");
  let checkboxId = event.target.id;
  let initials = getContactInitials(checkboxId);
  let initialsElement = document.getElementById(`${checkboxId}-${initials}`);

  if (event.target.checked) {
    if (!initialsElement) {
      let newSpan = document.createElement("span");
      newSpan.className = "initials-span";
      newSpan.id = `${checkboxId}-${initials}`;
      newSpan.textContent = initials;
      newSpan.style.backgroundColor = contacts[checkboxId].color; 
      assignments.appendChild(newSpan);
      addContacts(checkboxId);
    }
  } else {
    if (initialsElement) {
      initialsElement.remove();
      removeContacts(checkboxId);
    }
  }
}

/**
 * Filters contacts based on a search input by matching the full name (first and last name).
 * 
 * @param {string} id - The ID of the contact to be filtered.
 * @returns {boolean} True if the contact's full name includes the search input, otherwise false.
 */
function filterCheckboxes(id) {
  let filter = document.getElementById("search");
  let inputValue = filter.value.toLowerCase();
  let fullName = `${contacts[id].firstName.toLowerCase()} ${contacts[
    id
  ].lastName.toLowerCase()}`;
  return fullName.includes(inputValue);
}

/**
 * Updates the state of a checkbox based on whether the contact's initials are assigned.
 * If the contact's initials are found in the "assigned-contacts" container, the corresponding checkbox is checked.
 * 
 * @param {string} id - The ID of the contact.
 * @param {string} initials - The initials of the contact.
 */
function checkboxState(id, initials) {
  let assignedContact = document.getElementById(`${id}-${initials}`);
  
  if (assignedContact) {
    let checkbox = document.getElementById(`${id}`);
    checkbox.setAttribute("checked", "checked");
  }
}

/**
 * Renders checkboxes for each contact, with their initials and colors, and highlights selected contacts.
 */
function renderCheckboxesWithColors() {
  const checkboxesContainer = document.getElementById("checkboxes");

  if (!checkboxesContainer) {
    console.error("Element mit ID 'checkboxes' nicht gefunden. Rendering abgebrochen.");
    return;
  }

  checkboxesContainer.innerHTML = "";

  for (const id in contacts) {
    const initials = getContactInitials(id);
    const color = contacts[id].color || "#000000"; 
    const isChecked = selectedContactsSet.has(id);

    checkboxesContainer.innerHTML += `
      <label class="contact-label ${isChecked ? 'highlighted' : ''}" id="contact-${id}" onclick="toggleContact('${id}')">
        <div class="initial-contactName-container">
          <span class="initials-span" style="background-color:${color};">${initials}</span>
          <span>${contacts[id]["firstName"]} ${contacts[id]["lastName"]}</span>
        </div>
        <div class="custom-checkbox ${isChecked ? 'checked' : ''}" id="checkbox-${id}"></div>
      </label>
    `;
  }
}

/**
 * Toggles the visibility of the checkboxes container.
 * If the container is currently hidden, it will be shown, and vice versa.
 */
function toggleCheckboxes() {
  const checkboxes = document.getElementById("checkboxes");
  if (!checkboxes) {
    console.error("Element mit ID 'checkboxes' nicht gefunden.");
    return;
  }

  expanded = !expanded;
  checkboxes.style.display = expanded ? "block" : "none";
}

/**
 * Toggles the selection state of a contact, adding or removing it from the selected contacts set.
 * Updates the contact's label and checkbox, and calls functions to manage assigned contacts.
 * 
 * @param {string} contactId - The ID of the contact to toggle.
 */
function toggleContact(contactId) {
  const contactLabel = document.getElementById(`contact-${contactId}`);
  const checkbox = document.getElementById(`checkbox-${contactId}`);
  const isSelected = selectedContactsSet.has(contactId);

  if (isSelected) {
    selectedContactsSet.delete(contactId);
    contactLabel.classList.remove('highlighted');
    checkbox.classList.remove('checked');
    removeContacts(contactId);
  } else {
    selectedContactsSet.add(contactId);
    contactLabel.classList.add('highlighted');
    checkbox.classList.add('checked');
    addContacts(contactId);
  }
  updateAssignedContacts();
}

/**
 * Updates the list of assigned contacts by rendering the initials of each selected contact.
 * Clears the current list and re-renders the selected contacts based on the selectedContactsSet.
 */
function updateAssignedContacts() {
  const assignedDiv = document.getElementById("assigned-contacts");
  assignedDiv.innerHTML = '';

  selectedContactsSet.forEach(contactId => {
    const contact = contacts[contactId];
    if (contact) {
      let initials = getContactInitials(contactId);
      let assignedColor = contact.color || "#000000";

      assignedDiv.innerHTML += `<span class="initials-span" style="background-color:${assignedColor};">${initials}</span>`;
    }
  });
}

/**
 * Adds a contact ID to the assigned contacts list if it is not already present.
 * 
 * @param {string} contactId - The ID of the contact to be added to the list.
 */
function addContacts(contactId) {
  if (!assignedContacts.includes(contactId)) {
    assignedContacts = assignedContacts ? `${assignedContacts},${contactId}` : contactId;
  }
}

/**
 * Removes a contact ID from the assigned contacts list.
 * 
 * @param {string} contactId - The ID of the contact to be removed from the list.
 */
function removeContacts(contactId) {
  let partedIds = assignedContacts.split(",");
  let idx = partedIds.indexOf(contactId);
  if (idx !== -1) {
    partedIds.splice(idx, 1);
  }
  assignedContacts = partedIds.join(",");
}