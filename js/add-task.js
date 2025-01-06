"use strict";
let pathTasks = "tasks";

/**
 * Initializes the Add Task page by loading necessary data and setting up UI elements.
 * @async
 */
async function initAddTask() {
  await initFunc(); 
  radioButtonsSelectState();
}


/**
 * Initializes core functionalities by checking and invoking necessary functions.
 * @async
 */
async function initFunc() {
  if (typeof loadContacts === "function") {
    await loadContacts();
  } else {
    console.warn("Die Funktion 'loadContacts' ist nicht definiert.");
  }
}

/**
 * Dynamically includes HTML content into elements with the `w3-include-html` attribute.
 * @async
 */
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

/**
 * Retrieves the value of the title input field.
 * @returns {string} The title value.
 */
function getTitle() {
  let title = document.getElementById("title");
  return title.value;
}

/**
 * Retrieves the value of the description input field.
 * @returns {string} The description value.
 */
function getDescription() {
  let description = document.getElementById("description");
  return description.value;
}

/**
 * Retrieves the value of the date input field.
 * @returns {string} The date value.
 */
function getDate() {
  let date = document.getElementById("date");
  return date.value;
}

/**
 * Retrieves the value of the category input field.
 * @returns {string} The category value.
 */
function getCategory() {
  let category = document.getElementById("category");
  return category.value;
}

/**
 * Generates an SVG vertical separator line.
 * @param {string} width - The width of the SVG.
 * @param {string} height - The height of the SVG.
 * @param {string} stroke - The color of the line stroke.
 * @returns {string} The SVG markup for the vertical separator.
 */
function verticalSeparator(width, height, stroke) {
  return `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="0" y2="${height}" stroke="${stroke}" stroke-width="1"/>
    </svg>
  `;
}

/**
 * Creates a JSON object representing a task with all its properties.
 * @returns {Object} The task JSON object.
 */
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

/**
 * Creates a new task, validates required fields, formats data, and saves the task to the server.
 * @param {Event} event - The event object from the form submission.
 * @async
 */
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

/**
 * Clears all input elements except radio buttons and textareas.
 */
function clearInputElements() {
  let elements = document.querySelectorAll('input:not([type="radio"]), textarea');
  elements.forEach(element => {
    element.value = "";
  });
}

/**
 * Resets all select elements to their default state.
 */
function clearSelectElements() {
  let elements = document.querySelectorAll('select[type="text"]');
  elements.forEach(element => {
    element.selectedIndex = 0;
    element.classList.remove("invalid");
  });
}

/**
 * Clears all radio button selections and resets the priority variable.
 */
function clearRadioButtons() {
  let radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.checked = false;
  });
  priority = null;
}

/**
 * Clears all checkbox selections.
 */
function clearCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

/**
 * Clears the inner content of specific div elements and resets the subtasks array.
 */
function clearDivs() {
  let divs = document.querySelectorAll("#Assigned-contacts, #Subtask-list");
  divs.forEach(div => {
    div.innerHTML = "";
  });
  subtasks = [];
}

/**
 * Clears the form by resetting all fields, div contents, and state variables.
 */
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
  clearDivs();
}


