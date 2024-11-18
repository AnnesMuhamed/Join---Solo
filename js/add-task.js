"use strict";
let pathTasks = "tasks";

async function initAddTask() {
  await initFunc();
  radioButtonsSelectState();
}

async function initFunc() {
  // Fallback für fehlende Funktion
  if (typeof loadContacts === "function") {
    await loadContacts();
  } else {
    console.warn("Die Funktion 'loadContacts' ist nicht definiert.");
  }
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

function getTitle() {
  let title = document.getElementById("title");
  return title.value;
}

function getDescription() {
  let description = document.getElementById("description");
  return description.value;
}

function getDate() {
  let date = document.getElementById("date");
  return date.value;
}

function getCategory() {
  let category = document.getElementById("category");
  return category.value;
}

function verticalSeparator(width, height, stroke) {
  return `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="0" y2="${height}" stroke="${stroke}" stroke-width="1"/>
    </svg>
  `;
}

function createTaskJson() {
  let assignedContactsDetails = assignedContacts.map(contactId => {
    return {
      id: contactId,
      color: contacts[contactId]?.color || "#000000"
    };
  });

  let task = {
    title: getTitle(),
    description: getDescription(),
    assignment: assignedContactsDetails,
    date: getDate(),
    priority: priority,
    category: getCategory(),
    subtasks: subtasks.length > 0 ? JSON.stringify(subtasks) : "[]",
    state: "open"
  };
  return task;
}

async function createTask(event) {
  event.preventDefault();
  const title = getTitle();
  const date = getDate();
  const category = getCategory();
  const description = getDescription();
  if (!title || !date || !category) {
    alert("Bitte füllen Sie alle erforderlichen Felder (Titel, Fälligkeitsdatum, Kategorie) aus.");
    return;
  }

  let formattedSubtasks = [];
  if (Array.isArray(subtasks) && subtasks.length > 0) {
    formattedSubtasks = subtasks;
  }

  let formattedAssignedContacts = [];
  if (Array.isArray(assignedContacts) && assignedContacts.length > 0) {
    formattedAssignedContacts = assignedContacts.map(contactId => ({
      id: contactId,
      color: contacts[contactId]?.color || "#000000"
    }));
  }

  const selectedPriority = priority || null;
  const newTask = {
    title: title,
    description: description,
    assignment: formattedAssignedContacts,
    date: date,
    priority: selectedPriority,
    category: category,
    subtasks: formattedSubtasks,
    state: "open"
  };
  try {
    await postData(pathTasks, newTask);
    alert("Aufgabe erfolgreich erstellt und in Firebase gespeichert.");
    window.open("./board.html", "_self");
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
  }
}

function clearInputElements() {
  let elements = document.querySelectorAll('input:not([type="radio"]), textarea');
  elements.forEach(element => {
    element.value = "";
  });
}

function clearSelectElements() {
  let elements = document.querySelectorAll('select[type="text"]');
  elements.forEach(element => {
    element.selectedIndex = 0;
    element.classList.remove("invalid");
  });
}

function clearRadioButtons() {
  let radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.checked = false;
  });
  priority = null;
}

function clearCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

function clearDivs() {
  let divs = document.querySelectorAll("#Assigned-contacts, #Subtask-list");
  divs.forEach(div => {
    div.innerHTML = "";
  });
  subtasks = [];
}

function clearForm() {
  const subtaskList = document.getElementById("subtask-list");
  const assignedContacts = document.getElementById("assigned-contacts");
  if (subtaskList) {
    subtaskList.innerHTML = "";
  }

  if (assignedContacts) {
    assignedContacts.innerHTML = "";
  }

  clearInputElements();
  clearSubtaskInput();
  clearSelectElements();
  clearRadioButtons();
  clearCheckboxes();
}

