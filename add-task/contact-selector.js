"use strict";

let pathContacts = "contacts";

let expanded = false;
let contacts = null;

let assignedContacts = "";

function handleBodyClicks(event) {
  showCheckboxes(event);
  collapseCheckboxes(event);
  assignContacts(event);
}

async function loadContacts() {
  contacts = await loadData(pathContacts);
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
  let assignments = document.getElementById("assigned-contacts");
  if (event.target.type === "checkbox") {
    let checkboxId = event.target.id;
    let initials = getContactInitials(checkboxId);
    let initialsElement = document.getElementById(`${checkboxId}-${initials}`);
    if (initialsElement) {
      initialsElement.remove();
      removeContacts(checkboxId);
    } else {
      assignments.innerHTML += `
				<span class="initials-span" id="${checkboxId}-${initials}">${initials}</span>
		`;
      addContacts(checkboxId);
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
                <input type="checkbox" id="${id}">
            </label>
        `;
    checkboxState(id, initials);
  }
}

function showCheckboxes(event) {
  let checkboxes = document.getElementById("checkboxes");
  if (event.target.closest(".select-box")) {
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  }
}

function collapseCheckboxes(event) {
  let checkboxes = document.getElementById("checkboxes");
  let search = document.getElementById("search");
  if (!event.target.closest(".assignment-container")) {
    search.value = "";
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
