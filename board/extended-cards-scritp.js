let isEditing = false; // Status zur Bearbeitung

function getHtmlElements() {
  let popupContainer = document.querySelector(".popup-container");
  let popup = document.getElementById("popup");
  let tagContainer = document.getElementById("tag-container");
  let tag = document.getElementById("tag");
  let popupTitle = document.getElementById("popup-title");
  let popupSubtitle = document.getElementById("popup-subtitle");
  let dueDateElement = document.getElementById("due-date");
  let priorityContainer = document.getElementById("priority-container");
  let priorityLabel = document.getElementById("priority-label");
  let priorityIcon = document.getElementById("priority-icon");
  let assigneeContainer = document.getElementById("assignee-container");
  let subtasksList = document.getElementById("subtasks-list");
  return [
    popupContainer,
    popup,
    tagContainer,
    tag,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityContainer,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ];
}

function getTask(key) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  return tasks[key];
}

function determineTaskType(task, tagContainer, tag) {
  if (task.category === "Technical Task") {
    tagContainer.classList.remove("user-cards-headline-container");
    tagContainer.classList.add("technical-cards-headline-container");
    tag.textContent = "Technical Task";
  } else {
    tagContainer.classList.remove("technical-cards-headline-container");
    tagContainer.classList.add("user-cards-headline-container");
    tag.textContent = "User Story";
  }
}

function determinePopupTitle(task, popupTitle) {
  popupTitle.textContent = task.title;
}

function determinePopupSubtitle(task, popupSubtitle) {
  popupSubtitle.textContent = task.description;
}

function determineDate(task, dueDateElement) {
  dueDateElement.textContent = formatDate(task.date);
}

function determineTaskPriority(task, priorityLabel, priorityIcon) {
  if (task.priority) {
    priorityLabel.textContent = getPriorityLabel(task.priority);
    priorityLabel.classList.add("d-none");
    priorityIcon.classList.remove("d-none");
    priorityIcon.src = getPriorityIcon(task.priority);
  } else {
    priorityLabel.textContent = "";
    priorityIcon.classList.add("d-none");
  }
}

function determineAssignedContacts(task, assigneeContainer) {
  if (assigneeContainer) {
    assigneeContainer.innerHTML = ""; // Leeren des Containers

    if (task.assignment) {
      let contacts = JSON.parse(sessionStorage.getItem("contacts"));
      let assignedContactsIds = task.assignment.split(",");
      createAssignedContactsFields(assigneeContainer, assignedContactsIds, contacts);
    } else {
      assigneeContainer.innerHTML = "<span>No contacts assigned</span>";
    }
  }
}

function createAssignedContactsFields(assigneeContainer, assignedContacts, contacts) {
  assignedContacts.forEach((contactId) => {
    let currentContact = contacts[contactId];
    if (currentContact) {
      let contactInitials = getAssignedContactInitials(currentContact.firstName, currentContact.lastName);
      assigneeContainer.innerHTML += `
        <div class="assignee-underContainer">
          <div class="assignee-initials" style="background-color:${getRandomColor()}">
            ${contactInitials}
          </div>
          <span class="assignee-name">${currentContact.firstName} ${currentContact.lastName}</span>
        </div>`;
    }
  });
}

function determineSubtasks(task, subtasksList) {
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks);
  subtasks.forEach((subtask, index) => {
    let key = Object.keys(subtask)[0];
    let isChecked = subtask[key] === "done" ? "checked" : "";
    let subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <input type="checkbox" class="subtask-checkbox" id="subtask-${index}" ${isChecked}>
      <span class="subtask-label">${key}</span>
    `;
    
    // Event-Listener für Checkboxen
    subtaskItem.querySelector(`#subtask-${index}`).addEventListener("change", () => {
      updateSubtaskProgress(task);
    });

    subtasksList.appendChild(subtaskItem);
  });
}

function updateSubtaskProgress(task) {
  let subtasks = [];
  document.querySelectorAll("#subtasks-list .subtask-item").forEach((item, index) => {
    let text = item.querySelector(".subtask-label").textContent;
    let isChecked = item.querySelector(`#subtask-${index}`).checked;
    let status = isChecked ? "done" : "open";
    subtasks.push({ [text]: status });
  });

  task.subtasks = JSON.stringify(subtasks);
  sessionStorage.setItem("tasks", JSON.stringify(task));
  
  updateProgressOnBoard(task);
}

function updateProgressOnBoard(task) {
  let taskKey = task.id;
  let progressBar = document.getElementById(`${taskKey}-progress-bar`);

  let subtasks = JSON.parse(task.subtasks);
  let totalSubtasks = subtasks.length;
  let completedSubtasks = subtasks.filter(subtask => {
    let key = Object.keys(subtask)[0];
    return subtask[key] === "done";
  }).length;

  let progressPercent = (completedSubtasks / totalSubtasks) * 100;

  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  let subtasksCounter = document.getElementById(`${taskKey}-subtask-counter`);
  if (subtasksCounter) {
    subtasksCounter.textContent = `${completedSubtasks}/${totalSubtasks}`;
  }
}

function openPopup(key) {
  let [
    popupContainer,
    popup,
    tagContainer,
    tag,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityContainer,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ] = getHtmlElements();

  let task = getTask(key);

  determineTaskType(task, tagContainer, tag);
  determinePopupTitle(task, popupTitle);
  determinePopupSubtitle(task, popupSubtitle);
  determineDate(task, dueDateElement);
  determineTaskPriority(task, priorityLabel, priorityIcon);
  determineAssignedContacts(task, assigneeContainer);
  determineSubtasks(task, subtasksList);

  popup.dataset.taskKey = key;
  popupContainer.classList.add("show");
}

function makeFieldsReadOnly() {
  let popupTitle = document.getElementById("popup-title");
  let popupSubtitle = document.getElementById("popup-subtitle");
  let dueDateElement = document.getElementById("due-date");

  // Mache den Titel nicht mehr bearbeitbar
  popupTitle.contentEditable = false;
  popupTitle.classList.remove("editable");

  // Mache die Beschreibung nicht mehr bearbeitbar
  popupSubtitle.contentEditable = false;
  popupSubtitle.classList.remove("editable");

  // Überprüfe, ob das Datum bearbeitbar gemacht wurde, und setze es wieder zurück
  let dateInput = dueDateElement.querySelector("input");
  if (dateInput) {
    let dateSpan = document.createElement("span");
    dateSpan.textContent = dateInput.value;
    dueDateElement.innerHTML = "";
    dueDateElement.appendChild(dateSpan);
  }
}


function closePopup() {
  let popupContainer = document.querySelector(".popup-container");
  popupContainer.classList.remove("show");
  isEditing = false;
  resetEditButton();
  makeFieldsReadOnly();
}

function getPriorityLabel(priority) {
  switch (priority) {
    case "1":
      return "Low";
    case "2":
      return "Medium";
    case "3":
      return "High";
    default:
      return "";
  }
}

function getPriorityIcon(priority) {
  switch (priority) {
    case "1":
      return "../img/prio-low.png";
    case "2":
      return "../img/Prio media.png";
    case "3":
      return "../img/prio-high.png";
    default:
      return "";
  }
}

function editTask() {
  let popup = document.getElementById("popup");
  let taskKey = popup.dataset.taskKey;
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[taskKey];

  if (!isEditing) {
    isEditing = true;
    makeFieldsEditable(task);
    changeEditButtonToSave(); // Ändere den Button zu "Ok"
  } else {
    saveChanges(taskKey); // Speichere die Änderungen
    isEditing = false;
    resetEditButton(); // Setze den Button wieder auf "Edit" zurück
  }
}


function resetEditButton() {
  let editButton = document.querySelector(".action-button:nth-child(3)"); // Wähle den Bearbeitungs-Button
  if (editButton) {
    editButton.innerHTML = `
      <img src="../img/edit-black.png" alt="Edit" class="action-icon" />
      <span class="action-label">Edit</span>
    `;
  } else {
    console.error("Edit button not found.");
  }
}


function makeFieldsEditable(task) {
  let popupTitle = document.getElementById("popup-title");
  popupTitle.contentEditable = true;
  popupTitle.classList.add("editable");

  let popupSubtitle = document.getElementById("popup-subtitle");
  popupSubtitle.contentEditable = true;
  popupSubtitle.classList.add("editable");

  createEditableDateField(task);
  createEditablePrioButtons(task);
  makeContactsEditable(task);
}

function createEditableDateField(task) {
  let dueDateElement = document.getElementById("due-date");
  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = task.date;
  dateInput.classList.add("editable");
  dueDateElement.innerHTML = "";
  dueDateElement.appendChild(dateInput);
}

function createPrioButtons(radioButtonGroup) {
  let priorityObject = { high: 3, med: 2, low: 1 };

  Object.keys(priorityObject).forEach((key) => {
    let buttonLabel = document.createElement("label");
    let buttonSpan = document.createElement("span");
    let buttonImage = document.createElement("img");
    let buttonInput = document.createElement("input");

    buttonLabel.htmlFor = `prio-${key}`;
    buttonLabel.className = "radio-label";
    buttonSpan.textContent = key === "high" ? "Urgent" : key === "med" ? "Medium" : "Low";
    buttonImage.src = `../img/add-task/prio-${key}.png`;
    buttonInput.type = "radio";
    buttonInput.id = `prio-${key}`;
    buttonInput.name = "prios";
    buttonInput.value = `${priorityObject[key]}`;
    buttonInput.className = "radio-button";

    buttonLabel.appendChild(buttonSpan);
    buttonLabel.appendChild(buttonImage);
    radioButtonGroup.appendChild(buttonLabel);
    radioButtonGroup.appendChild(buttonInput);
  });
}

function createEditablePrioButtons(task) {
  priority = task.priority;
  let prioLabel = document.getElementById("priority-label");
  let prioIcon = document.getElementById("priority-icon");
  prioLabel.classList.remove("d-none");
  prioLabel.innerHTML = "";
  prioIcon.classList.add("d-none");

  let radioButtonGroup = document.createElement("div");
  radioButtonGroup.id = "radio-button-group-edit";
  radioButtonGroup.classList.add("radio-button-group");
  createPrioButtons(radioButtonGroup);
  prioLabel.appendChild(radioButtonGroup);
}

function changeEditButtonToSave() {
  let editButton = document.querySelector(".action-button:nth-child(3)"); // Wähle den Bearbeitungs-Button
  if (editButton) {
    editButton.innerHTML = `
      <span class="action-label">Ok</span>
      <img src="../img/hook.png" alt="Save" class="action-icon" />
    `;
  } else {
    console.error("Edit button not found.");
  }
}


function makeContactsEditable(task) {
  let assigneeContainer = document.getElementById("assignee-container");
  assigneeContainer.innerHTML = `
    <div class="select-box">
      <input id="edit-search" class="assignment-selector definition-entry-field" type="text" name="assignment" placeholder="Select contacts to assign">
    </div>
    <div id="edit-checkboxes"></div>
    <div id="edit-assigned-contacts"></div>`;

  let assignedContactsContainer = document.getElementById("edit-assigned-contacts");
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  let assignedContactsIds = task.assignment.split(",");

  createAssignedContactsFields(assignedContactsContainer, assignedContactsIds, contacts);
  renderCheckboxesForEditMode(assignedContactsIds);
}

function renderCheckboxesForEditMode(assignedContactsIds) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  let checkboxesContainer = document.getElementById("edit-checkboxes");
  checkboxesContainer.innerHTML = "";

  Object.keys(contacts).forEach(contactId => {
    let contact = contacts[contactId];
    let isChecked = assignedContactsIds.includes(contactId) ? "checked" : "";

    checkboxesContainer.innerHTML += `
      <label>
        <input type="checkbox" id="${contactId}" ${isChecked} />
        ${contact.firstName} ${contact.lastName}
      </label>`;
  });

  document.querySelectorAll("#edit-checkboxes input").forEach(input => {
    input.addEventListener("change", function () {
      updateAssignedContacts(input);
    });
  });
}

function updateAssignedContacts(input) {
  let assignments = document.getElementById("edit-assigned-contacts");
  let contactId = input.id;
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  let contact = contacts[contactId];

  if (input.checked) {
    assignments.innerHTML += `
      <div class="assignee-underContainer" id="assigned-${contactId}">
        <div class="assignee-initials" style="background-color:${getRandomColor()}">
          ${getAssignedContactInitials(contact.firstName, contact.lastName)}
        </div>
        <span class="assignee-name">${contact.firstName} ${contact.lastName}</span>
      </div>`;
  } else {
    let assignedElement = document.getElementById(`assigned-${contactId}`);
    if (assignedElement) {
      assignedElement.remove();
    }
  }
}

function saveChanges(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[taskKey];

  task.title = document.getElementById("popup-title").textContent;
  task.description = document.getElementById("popup-subtitle").textContent;

  let dueDateInput = document.querySelector("#due-date input");
  if (dueDateInput) {
    task.date = dueDateInput.value;
  }

  task.priority = priority;

  let selectedContacts = [];
  document.querySelectorAll("#edit-checkboxes input:checked").forEach((input) => {
    selectedContacts.push(input.id);
  });
  task.assignment = selectedContacts.join(",");

  sessionStorage.setItem("tasks", JSON.stringify(tasks));
  updateData(PATH_TO_TASKS, tasks);
  renderCards();
  makeFieldsReadOnly();
  openPopup(taskKey);
}

function deleteTask() {
  let popup = document.getElementById("popup");
  let taskKey = popup.dataset.taskKey;

  if (confirm("Are you sure you want to delete this task?")) {
    let tasks = JSON.parse(sessionStorage.getItem("tasks"));
    delete tasks[taskKey];
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    updateData(PATH_TO_TASKS, tasks);
    closePopup();
    renderCards();
  }
}


function loadPopupScripts(templateUrl) {
  fetch(templateUrl)
    .then(response => response.text())
    .then(data => {
      const popupContainer = document.querySelector(".popup-container");
      const scriptContainer = document.createElement('div');
      scriptContainer.innerHTML = data;
      popupContainer.appendChild(scriptContainer);
    })
    .catch(error => console.error('Error loading template:', error));
}

document.addEventListener("DOMContentLoaded", function () {
  // Lädt die Skripte ins Popup, wenn das Popup geladen wird
  loadPopupScripts('../templates/popup-scripts-template.html');
});














