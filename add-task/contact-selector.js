"use strict";

let pathContacts = "contacts";
let expanded = false;
let contacts = null;
let selectedContactsSet = new Set();
let assignedContacts = "";

async function loadContacts() {
  contacts = await loadData(pathContacts);
  console.log("Kontakte geladen:", contacts);
  if (contacts) {
    renderCheckboxesWithColors(); 
  } else {
    console.error("Kontakte konnten nicht geladen werden.");
  }
}

function getContactsIds() {
  let contactsIds = [];
  for (let id in contacts) {
    contactsIds.push(id);
  }
  return contactsIds;
}

function getContactInitials(id) {
  return `${contacts[id]["firstName"].charAt(0)}${contacts[id]["lastName"].charAt(0)}`;
}

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

function filterCheckboxes(id) {
  let filter = document.getElementById("search");
  let inputValue = filter.value.toLowerCase();
  let fullName = `${contacts[id].firstName.toLowerCase()} ${contacts[
    id
  ].lastName.toLowerCase()}`;
  return fullName.includes(inputValue);
}

function checkboxState(id, initials) {
  let assignedContact = document.getElementById(`${id}-${initials}`);
  if (assignedContact) {
    let checkbox = document.getElementById(`${id}`);
    checkbox.setAttribute("checked", "checked");
  }
}

function renderCheckboxesWithColors() {
  const checkboxesContainer = document.getElementById("checkboxes");
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

function toggleCheckboxes() {
  const checkboxes = document.getElementById("checkboxes");
  expanded = !expanded;
  checkboxes.style.display = expanded ? "block" : "none";
}

function addContacts(contactId) {
  if (!assignedContacts.includes(contactId)) {
    assignedContacts = assignedContacts ? `${assignedContacts},${contactId}` : contactId;
  }
}

function removeContacts(contactId) {
  let partedIds = assignedContacts.split(",");
  let idx = partedIds.indexOf(contactId);
  if (idx !== -1) {
    partedIds.splice(idx, 1);
  }
  assignedContacts = partedIds.join(",");
}
