"use strict";

let pathContacts = "contacts";

let expanded = false;
let contacts = null;

let assignedContacts = "";

async function loadContacts() {
  contacts = await loadData(pathContacts); 
  console.log("Kontakte geladen:", contacts);
  if (contacts) {
    renderCheckboxes(); 
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
  return `${contacts[id]["firstName"].charAt(0)}${contacts[id][
    "lastName"
  ].charAt(0)}`;
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

function renderCheckboxes() {
  let contactsIds = getContactsIds();
  let checkboxes = document.getElementById("checkboxes");
  checkboxes.innerHTML = "";
  for (let n = 0; n < contactsIds.length; n++) {
    let id = contactsIds[n];
    let initials = getContactInitials(id);
    if (!filterCheckboxes(id)) {
      continue;
    }
    checkboxes.innerHTML += `
      <label for="${id}">
        <span class="initials-span">${initials}</span>
        <span>${contacts[id]["firstName"]} ${contacts[id]["lastName"]}</span>
        <input type="checkbox" id="${id}" onclick="assignContacts(event)">
      </label>
    `;
    checkboxState(id, initials);
  }
}

function toggleCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
  } else {
      checkboxes.style.display = "none";
      expanded = false;
  }
}

function addContacts(contactId) {
  if (assignedContacts.length > 0) {
    assignedContacts += `,${contactId}`;
  } else {
    assignedContacts += contactId;
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
