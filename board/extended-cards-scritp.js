// let isEditing = false; // Status zur Bearbeitung

// function getHtmlElements() {
//   let popupContainer = document.querySelector(".popup-container");
//   let popup = document.getElementById("popup");
//   let tagContainer = document.getElementById("tag-container");
//   let tag = document.getElementById("tag");
//   let popupTitle = document.getElementById("popup-title");
//   let popupSubtitle = document.getElementById("popup-subtitle");
//   let dueDateElement = document.getElementById("due-date");
//   let priorityContainer = document.getElementById("priority-container");
//   let priorityLabel = document.getElementById("priority-label");
//   let priorityIcon = document.getElementById("priority-icon");
//   let assigneeContainer = document.getElementById("assignee-container");
//   let subtasksList = document.getElementById("subtasks-list");
//   return [
//     popupContainer,
//     popup,
//     tagContainer,
//     tag,
//     popupTitle,
//     popupSubtitle,
//     dueDateElement,
//     priorityContainer,
//     priorityLabel,
//     priorityIcon,
//     assigneeContainer,
//     subtasksList,
//   ];
// }

// function getTask(key) {
//   let tasks = JSON.parse(sessionStorage.getItem("tasks"));
//   return tasks[key];
// }

// function determineTaskType(task, tagContainer, tag) {
//   if (task.category === "Technical Task") {
//     tagContainer.classList.remove("user-cards-headline-container");
//     tagContainer.classList.add("technical-cards-headline-container");
//     tag.textContent = "Technical Task";
//   } else {
//     tagContainer.classList.remove("technical-cards-headline-container");
//     tagContainer.classList.add("user-cards-headline-container");
//     tag.textContent = "User Story";
//   }
// }

// function determinePopupTitle(task, popupTitle) {
//   popupTitle.textContent = task.title;
// }

// function determinePopupSubtitle(task, popupSubtitle) {
//   popupSubtitle.textContent = task.description;
// }

// function determineDate(task, dueDateElement) {
//   dueDateElement.textContent = formatDate(task.date);
// }

// function determineTaskPriority(task, priorityLabel, priorityIcon) {
//   if (task.priority) {
//     priorityLabel.textContent = getPriorityLabel(task.priority);
//     priorityLabel.classList.add("d-none");
//     priorityIcon.classList.remove("d-none");
//     priorityIcon.src = getPriorityIcon(task.priority);
//   } else {
//     priorityLabel.textContent = "";
//     priorityIcon.classList.add("d-none");
//   }
// }

// function determineAssignedContacts(task, assigneeContainer) {
//   if (assigneeContainer) {
//     assigneeContainer.innerHTML = ""; // Leeren des Containers

//     if (task.assignment) {
//       let contacts = JSON.parse(sessionStorage.getItem("contacts"));
//       let assignedContactsIds = task.assignment.split(",");
//       createAssignedContactsFields(assigneeContainer, assignedContactsIds, contacts);
//     } else {
//       assigneeContainer.innerHTML = "<span>No contacts assigned</span>";
//     }
//   }
// }

// function createAssignedContactsFields(assigneeContainer, assignedContacts, contacts) {
//   assignedContacts.forEach((contactId) => {
//     let currentContact = contacts[contactId];
//     if (currentContact) {
//       let contactInitials = getAssignedContactInitials(currentContact.firstName, currentContact.lastName);
//       assigneeContainer.innerHTML += `
//         <div class="assignee-underContainer">
//           <div class="assignee-initials" style="background-color:${getRandomColor()}">
//             ${contactInitials}
//           </div>
//           <span class="assignee-name">${currentContact.firstName} ${currentContact.lastName}</span>
//         </div>`;
//     }
//   });
// }

// function determineSubtasks(task, subtasksList) {
//   subtasksList.innerHTML = "";
//   let subtasks = JSON.parse(task.subtasks);
//   subtasks.forEach((subtask, index) => {
//     let key = Object.keys(subtask)[0];
//     let isChecked = subtask[key] === "done" ? "checked" : "";
//     let subtaskItem = document.createElement("div");
//     subtaskItem.className = "subtask-item";
//     subtaskItem.innerHTML = `
//       <input type="checkbox" class="subtask-checkbox" id="subtask-${index}" ${isChecked}>
//       <span class="subtask-label">${key}</span>
//     `;
    
//     // Event-Listener für Checkboxen
//     subtaskItem.querySelector(`#subtask-${index}`).addEventListener("change", () => {
//       updateSubtaskProgress(task);
//     });

//     subtasksList.appendChild(subtaskItem);
//   });
// }

// function updateSubtaskProgress(task) {
//   let subtasks = [];
//   document.querySelectorAll("#subtasks-list .subtask-item").forEach((item, index) => {
//     let text = item.querySelector(".subtask-label").textContent;
//     let isChecked = item.querySelector(`#subtask-${index}`).checked;
//     let status = isChecked ? "done" : "open";
//     subtasks.push({ [text]: status });
//   });

//   task.subtasks = JSON.stringify(subtasks);
//   sessionStorage.setItem("tasks", JSON.stringify(task));
  
//   updateProgressOnBoard(task);
// }

// function updateProgressOnBoard(task) {
//   let taskKey = task.id;
//   let progressBar = document.getElementById(`${taskKey}-progress-bar`);

//   let subtasks = JSON.parse(task.subtasks);
//   let totalSubtasks = subtasks.length;
//   let completedSubtasks = subtasks.filter(subtask => {
//     let key = Object.keys(subtask)[0];
//     return subtask[key] === "done";
//   }).length;

//   let progressPercent = (completedSubtasks / totalSubtasks) * 100;

//   if (progressBar) {
//     progressBar.style.width = `${progressPercent}%`;
//   }

//   let subtasksCounter = document.getElementById(`${taskKey}-subtask-counter`);
//   if (subtasksCounter) {
//     subtasksCounter.textContent = `${completedSubtasks}/${totalSubtasks}`;
//   }
// }

// function openPopup(key) {
//   let [
//     popupContainer,
//     popup,
//     tagContainer,
//     tag,
//     popupTitle,
//     popupSubtitle,
//     dueDateElement,
//     priorityContainer,
//     priorityLabel,
//     priorityIcon,
//     assigneeContainer,
//     subtasksList,
//   ] = getHtmlElements();

//   let task = getTask(key);

//   determineTaskType(task, tagContainer, tag);
//   determinePopupTitle(task, popupTitle);
//   determinePopupSubtitle(task, popupSubtitle);
//   determineDate(task, dueDateElement);
//   determineTaskPriority(task, priorityLabel, priorityIcon);
//   determineAssignedContacts(task, assigneeContainer);
//   determineSubtasks(task, subtasksList);

//   popup.dataset.taskKey = key;
//   popupContainer.classList.add("show");
// }

// // function editTaskForm(key) {
// //   let task = getTask(key);
// //   openForm("editTask");
// //   document.getElementById('title').value = task.title;
// // document.getElementById('description').value = task.description;

// // document.getElementById('create-btn').innerHTML = 'Save Task';
// // document.getElementById('create-btn').onclick = saveEitTask(...);
// // }

// function makeFieldsReadOnly() {
//   let popupTitle = document.getElementById("popup-title");
//   let popupSubtitle = document.getElementById("popup-subtitle");
//   let dueDateElement = document.getElementById("due-date");

//   // Mache den Titel nicht mehr bearbeitbar
//   popupTitle.contentEditable = false;
//   popupTitle.classList.remove("editable");

//   // Mache die Beschreibung nicht mehr bearbeitbar
//   popupSubtitle.contentEditable = false;
//   popupSubtitle.classList.remove("editable");

//   // Überprüfe, ob das Datum bearbeitbar gemacht wurde, und setze es wieder zurück
//   let dateInput = dueDateElement.querySelector("input");
//   if (dateInput) {
//     let dateSpan = document.createElement("span");
//     dateSpan.textContent = dateInput.value;
//     dueDateElement.innerHTML = "";
//     dueDateElement.appendChild(dateSpan);
//   }
// }


// function closePopup() {
//   let popupContainer = document.querySelector(".popup-container");
//   popupContainer.classList.remove("show");
//   isEditing = false;
//   resetEditButton();
//   makeFieldsReadOnly();
// }

// function getPriorityLabel(priority) {
//   switch (priority) {
//     case "1":
//       return "Low";
//     case "2":
//       return "Medium";
//     case "3":
//       return "High";
//     default:
//       return "";
//   }
// }

// function getPriorityIcon(priority) {
//   switch (priority) {
//     case "1":
//       return "../img/prio-low.png";
//     case "2":
//       return "../img/Prio media.png";
//     case "3":
//       return "../img/prio-high.png";
//     default:
//       return "";
//   }
// }

// function editTask() {
//   let popup = document.getElementById("popup");
//   let taskKey = popup.dataset.taskKey;
//   let tasks = JSON.parse(sessionStorage.getItem("tasks"));
//   let task = tasks[taskKey];

//   if (!isEditing) {
//     isEditing = true;
//     makeFieldsEditable(task);
//     changeEditButtonToSave(); // Ändere den Button zu "Ok"
//   } else {
//     saveChanges(taskKey); // Speichere die Änderungen
//     isEditing = false;
//     resetEditButton(); // Setze den Button wieder auf "Edit" zurück
//   }
// }


// function resetEditButton() {
//   let editButton = document.querySelector(".action-button:nth-child(3)"); // Wähle den Bearbeitungs-Button
//   if (editButton) {
//     editButton.innerHTML = `
//       <img src="../img/edit-black.png" alt="Edit" class="action-icon" />
//       <span class="action-label">Edit</span>
//     `;
//   } else {
//     console.error("Edit button not found.");
//   }
// }


// function makeFieldsEditable(task) {
//   let popupTitle = document.getElementById("popup-title");
//   popupTitle.contentEditable = true;
//   popupTitle.classList.add("editable");

//   let popupSubtitle = document.getElementById("popup-subtitle");
//   popupSubtitle.contentEditable = true;
//   popupSubtitle.classList.add("editable");

//   createEditableDateField(task);
//   createEditablePrioButtons(task);
//   makeContactsEditable(task);
// }

// function createEditableDateField(task) {
//   let dueDateElement = document.getElementById("due-date");
//   let dateInput = document.createElement("input");
//   dateInput.type = "date";
//   dateInput.value = task.date;
//   dateInput.classList.add("editable");
//   dueDateElement.innerHTML = "";
//   dueDateElement.appendChild(dateInput);
// }

// function createPrioButtons(radioButtonGroup) {
//   let priorityObject = { high: 3, med: 2, low: 1 };

//   Object.keys(priorityObject).forEach((key) => {
//     let buttonLabel = document.createElement("label");
//     let buttonSpan = document.createElement("span");
//     let buttonImage = document.createElement("img");
//     let buttonInput = document.createElement("input");

//     buttonLabel.htmlFor = `prio-${key}`;
//     buttonLabel.className = "radio-label";
//     buttonSpan.textContent = key === "high" ? "Urgent" : key === "med" ? "Medium" : "Low";
//     buttonImage.src = `../img/add-task/prio-${key}.png`;
//     buttonInput.type = "radio";
//     buttonInput.id = `prio-${key}`;
//     buttonInput.name = "prios";
//     buttonInput.value = `${priorityObject[key]}`;
//     buttonInput.className = "radio-button";

//     buttonLabel.appendChild(buttonSpan);
//     buttonLabel.appendChild(buttonImage);
//     radioButtonGroup.appendChild(buttonLabel);
//     radioButtonGroup.appendChild(buttonInput);
//   });
// }

// function createEditablePrioButtons(task) {
//   priority = task.priority;
//   let prioLabel = document.getElementById("priority-label");
//   let prioIcon = document.getElementById("priority-icon");
//   prioLabel.classList.remove("d-none");
//   prioLabel.innerHTML = "";
//   prioIcon.classList.add("d-none");

//   let radioButtonGroup = document.createElement("div");
//   radioButtonGroup.id = "radio-button-group-edit";
//   radioButtonGroup.classList.add("radio-button-group");
//   createPrioButtons(radioButtonGroup);
//   prioLabel.appendChild(radioButtonGroup);
// }

// function changeEditButtonToSave() {
//   let editButton = document.querySelector(".action-button:nth-child(3)"); // Wähle den Bearbeitungs-Button
//   if (editButton) {
//     editButton.innerHTML = `
//       <span class="action-label">Ok</span>
//       <img src="../img/hook.png" alt="Save" class="action-icon" />
//     `;
//   } else {
//     console.error("Edit button not found.");
//   }
// }

// function saveEditTask(key) {
//   let tasks = JSON.parse(sessionStorage.getItem("tasks"));
//   let task = tasks[key];

//   // Speichere die Änderungen aus dem Formular
//   task.title = document.getElementById('titleEdit').value;
//   task.description = document.getElementById('descriptionEdit').value;
//   task.date = document.getElementById('dateEdit').value;

//   sessionStorage.setItem("tasks", JSON.stringify(tasks)); // Speicher den Task
//   closeForm('editTask');  // Schließe das Formular
//   renderCards();  // Aktualisiere das Board mit den Änderungen
// }



// function makeContactsEditable(task) {
//   let assigneeContainer = document.getElementById("assignee-container");
//   assigneeContainer.innerHTML = `
//     <div class="select-box">
//       <input id="edit-search" class="assignment-selector definition-entry-field" type="text" name="assignment" placeholder="Select contacts to assign">
//     </div>
//     <div id="edit-checkboxes"></div>
//     <div id="edit-assigned-contacts"></div>`;

//   let assignedContactsContainer = document.getElementById("edit-assigned-contacts");
//   let contacts = JSON.parse(sessionStorage.getItem("contacts"));
//   let assignedContactsIds = task.assignment.split(",");

//   createAssignedContactsFields(assignedContactsContainer, assignedContactsIds, contacts);
//   renderCheckboxesForEditMode(assignedContactsIds);
// }

// function renderCheckboxesForEditMode(assignedContactsIds) {
//   let contacts = JSON.parse(sessionStorage.getItem("contacts"));
//   let checkboxesContainer = document.getElementById("edit-checkboxes");
//   checkboxesContainer.innerHTML = "";

//   Object.keys(contacts).forEach(contactId => {
//     let contact = contacts[contactId];
//     let isChecked = assignedContactsIds.includes(contactId) ? "checked" : "";

//     checkboxesContainer.innerHTML += `
//       <label>
//         <input type="checkbox" id="${contactId}" ${isChecked} />
//         ${contact.firstName} ${contact.lastName}
//       </label>`;
//   });

//   document.querySelectorAll("#edit-checkboxes input").forEach(input => {
//     input.addEventListener("change", function () {
//       updateAssignedContacts(input);
//     });
//   });
// }

// function updateAssignedContacts(input) {
//   let assignments = document.getElementById("edit-assigned-contacts");
//   let contactId = input.id;
//   let contacts = JSON.parse(sessionStorage.getItem("contacts"));
//   let contact = contacts[contactId];

//   if (input.checked) {
//     assignments.innerHTML += `
//       <div class="assignee-underContainer" id="assigned-${contactId}">
//         <div class="assignee-initials" style="background-color:${getRandomColor()}">
//           ${getAssignedContactInitials(contact.firstName, contact.lastName)}
//         </div>
//         <span class="assignee-name">${contact.firstName} ${contact.lastName}</span>
//       </div>`;
//   } else {
//     let assignedElement = document.getElementById(`assigned-${contactId}`);
//     if (assignedElement) {
//       assignedElement.remove();
//     }
//   }
// }

// function saveChanges(taskKey) {
//   let tasks = JSON.parse(sessionStorage.getItem("tasks"));
//   let task = tasks[taskKey];

//   task.title = document.getElementById("popup-title").textContent;
//   task.description = document.getElementById("popup-subtitle").textContent;

//   let dueDateInput = document.querySelector("#due-date input");
//   if (dueDateInput) {
//     task.date = dueDateInput.value;
//   }

//   task.priority = priority;

//   let selectedContacts = [];
//   document.querySelectorAll("#edit-checkboxes input:checked").forEach((input) => {
//     selectedContacts.push(input.id);
//   });
//   task.assignment = selectedContacts.join(",");

//   sessionStorage.setItem("tasks", JSON.stringify(tasks));
//   updateData(PATH_TO_TASKS, tasks);
//   renderCards();
//   makeFieldsReadOnly();
//   openPopup(taskKey);
// }

// function deleteTask() {
//   let popup = document.getElementById("popup");
//   let taskKey = popup.dataset.taskKey;

//   if (confirm("Are you sure you want to delete this task?")) {
//     let tasks = JSON.parse(sessionStorage.getItem("tasks"));
//     delete tasks[taskKey];
//     sessionStorage.setItem("tasks", JSON.stringify(tasks));
//     updateData(PATH_TO_TASKS, tasks);
//     closePopup();
//     renderCards();
//   }
// }


// function loadPopupScripts(templateUrl) {
//   fetch(templateUrl)
//     .then(response => response.text())
//     .then(data => {
//       const popupContainer = document.querySelector(".popup-container");
//       const scriptContainer = document.createElement('div');
//       scriptContainer.innerHTML = data;
//       popupContainer.appendChild(scriptContainer);
//     })
//     .catch(error => console.error('Error loading template:', error));
// }

// document.addEventListener("DOMContentLoaded", function () {
//   // Lädt die Skripte ins Popup, wenn das Popup geladen wird
//   loadPopupScripts('../templates/popup-scripts-template.html');
// });

// function openEditTaskForm() {
//   let taskKey = document.getElementById("popup").dataset.taskKey; // Hole den Task-Key aus dem Popup
//   let task = getTask(taskKey); // Hole den Task basierend auf dem Schlüssel

//   // Ersetze den Popup-Inhalt durch das Bearbeitungsformular
//   document.getElementById("popup").innerHTML = generateNewTaskTemplate('editTask', 'Edit');
  
//   // Fülle das Formular mit den aktuellen Task-Daten
//   document.getElementById('titleEdit').value = task.title;
//   document.getElementById('descriptionEdit').value = task.description;
//   document.getElementById('dateEdit').value = task.date;

//   // Setze den Text und die Funktion des Buttons auf "Save Task"
//   document.getElementById('create-btnEdit').innerHTML = 'Save Task';
//   document.getElementById('create-btnEdit').onclick = function() {
//     saveEditTask(taskKey);
//   };
// }

// function closeForm(formId) {
//   document.getElementById(formId).classList.remove("show");
//   document.getElementById("overlay").style.display = "none";
//   document.body.classList.remove("modal-open");
// }


let isEditing = false; // Status zur Bearbeitung

function getHtmlElements() {
  let popupContainer = document.querySelector(".popup-container");
  let popup = document.getElementById("popup");
  let popupTitle = document.getElementById("popup-title");
  let popupSubtitle = document.getElementById("popup-subtitle");
  let dueDateElement = document.getElementById("due-date");
  let priorityLabel = document.getElementById("priority-label");
  let priorityIcon = document.getElementById("priority-icon");
  let assigneeContainer = document.getElementById("assignee-container");
  let subtasksList = document.getElementById("subtasks-list");
  return [
    popupContainer,
    popup,
    popupTitle,
    popupSubtitle,
    dueDateElement,
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

function getPriorityLabel(priority) {
  switch (priority) {
    case "1":
      return "Low";
    case "2":
      return "Medium";
    case "3":
      return "High";
    default:
      return "No Priority"; // Fallback, falls keine Priorität vorhanden ist
  }
}

function openPopup(key) {
  let [
    popupContainer,
    popup,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ] = getHtmlElements();

  let task = getTask(key);

  // Überprüfe, ob die relevanten Elemente existieren, bevor du auf sie zugreifst
  if (!task) {
    console.error(`Task with key ${key} not found`);
    return;
  }

  if (popupTitle) {
    popupTitle.textContent = task.title || 'No title available';
  } else {
    console.error("popupTitle element not found");
  }

  if (popupSubtitle) {
    popupSubtitle.textContent = task.description || 'No description available';
  } else {
    console.error("popupSubtitle element not found");
  }

  if (dueDateElement) {
    dueDateElement.textContent = task.date ? formatDate(task.date) : 'No due date available';
  } else {
    console.error("dueDateElement not found");
  }

  // Bestimme die Priorität
  determineTaskPriority(task, priorityLabel, priorityIcon);
  // Zeige die zugewiesenen Kontakte an
  loadAssignees(task, assigneeContainer);
  // Zeige die Subtasks an
  loadSubtasks(task, subtasksList);

  popup.dataset.taskKey = key;
  popupContainer.classList.add("show");
}

function formatDate(dateString) {
  if (!dateString) return 'No due date'; // Falls das Datum nicht existiert

  let date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date'; // Falls das Datum ungültig ist

  // Format in "TT.MM.JJJJ"
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Monate von 0-11
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function determineTaskPriority(task, priorityLabel, priorityIcon) {
  if (task.priority) {
    priorityLabel.textContent = getPriorityLabel(task.priority);
    priorityIcon.src = getPriorityIcon(task.priority);
    priorityIcon.classList.remove("d-none");
  } else {
    priorityLabel.textContent = "No Priority";
    priorityIcon.classList.add("d-none");
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

function loadAssignees(task, assigneeContainer) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  assigneeContainer.innerHTML = ""; 
  let assignedContacts = task.assignment ? task.assignment.split(",") : [];
  assignedContacts.forEach((contactId) => {
    let currentContact = contacts[contactId];
    if (currentContact) {
      assigneeContainer.innerHTML += `
        <div class="assignee-underContainer">
          <div class="assignee-initials" style="background-color:${getRandomColor()}">
            ${getAssignedContactInitials(currentContact.firstName, currentContact.lastName)}
          </div>
          <span class="assignee-name">${currentContact.firstName} ${currentContact.lastName}</span>
        </div>`;
    }
  });
}

function loadSubtasks(task, subtasksList) {
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks || "[]");
  subtasks.forEach((subtask, index) => {
    let key = Object.keys(subtask)[0];
    let isChecked = subtask[key] === "done" ? "checked" : "";
    subtasksList.innerHTML += `
      <div class="subtask-item">
        <input type="checkbox" class="subtask-checkbox" id="subtask-${index}" ${isChecked} disabled>
        <span class="subtask-label">${key}</span>
      </div>`;
  });
}

function editTask(taskId) {
  const popupContainer = document.querySelector('.popup-container');
  const popupContent = document.getElementById('popup');

  fetch('../templates/add-task-content.html')
    .then(response => response.text())
    .then(html => {
      popupContent.innerHTML = /*html*/`
        <form id="edit-task-form" class="edit-task-form">
          <div class="d-flex-col">
            <label for="title">Title</label>
            <input type="text" id="title" class="definition-entry-field" placeholder="Enter a title" required>
          </div>
          <div class="d-flex-col">
            <label for="description">Description</label>
            <textarea id="description" class="definition-entry-field" placeholder="Enter a description"></textarea>
          </div>
          <div class="d-flex-col">
            <label for="due-date">Due date</label>
            <input type="date" id="due-date" class="properties-entry-field" required>
          </div>
          <div class="d-flex-col">
            <label>Priority</label>
            <div id="radio-button-group-edit" class="radio-button-group">
              <input type="radio" id="prio-high" name="prios" value="3" class="radio-button">
              <label for="prio-high" class="radio-label"><span>Urgent</span><img class="rp-prio-img" src="../img/add-task/prio-high.png"></label>
              <input type="radio" id="prio-med" name="prios" value="2" class="radio-button">
              <label for="prio-med" class="radio-label"><span>Medium</span><img class="rp-prio-img" src="../img/add-task/prio-med.png"></label>
              <input type="radio" id="prio-low" name="prios" value="1" class="radio-button">
              <label for="prio-low" class="radio-label"><span>Low</span><img class="rp-prio-img" src="../img/add-task/prio-low.png"></label>
            </div>
          </div>
          <div class="d-flex-col assignment-container">
            <label for="assignment">Select contacts to assign</label>
            <div class="select-box">
              <input id="search" class="assignment-selector" type="text" placeholder="Select contacts to assign">
            </div>
            <div id="checkboxes"></div>
            <div id="assigned-contacts"></div>
          </div>
          <div class="d-flex-col">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
              <input type="text" id="subtasks" class="properties-entry-field" placeholder="Add new subtask">
              <div id="subtask-buttons-container" class="add-subtask-button">
                <button id="add-subtask-button" class="in-line-btn" type="button"><img src="../img/add-task/add.png"></button>
              </div>
            </div>
          </div>
          <ul id="subtask-list" class="subtask-list"></ul>
        </form>
        <div class="popup-actions">
          <button class="action-button" onclick="saveEditedTask('${taskId}')">
            <img src="../img/save.png" alt="Save" class="action-icon">
            <span class="action-label">Save</span>
          </button>
          <button class="action-button" onclick="closePopup()">
            <img src="../img/close.png" alt="Close" class="action-icon">
            <span class="action-label">Cancel</span>
          </button>
        </div>
      `;

      populateTaskForm(taskId);
      popupContainer.classList.add('show');
    })
    .catch(error => console.error('Error loading Add Task form:', error));
}

function populateTaskForm(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (task) {
    document.getElementById('title').value = task.title || '';
    document.getElementById('description').value = task.description || '';
    document.getElementById('due-date').value = task.date || '';

    let priorityElement = document.querySelector(`input[name="prios"][value="${task.priority}"]`);
    if (priorityElement) priorityElement.checked = true;

    let assignees = task.assignment.split(',');
    assignees.forEach(assigneeId => {
      let assigneeCheckbox = document.querySelector(`input[name="assignees"][value="${assigneeId}"]`);
      if (assigneeCheckbox) assigneeCheckbox.checked = true;
    });

    let subtasks = JSON.parse(task.subtasks || "[]");
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
      let key = Object.keys(subtask)[0];
      let isChecked = subtask[key] === "done" ? "checked" : "";
      subtaskList.innerHTML += `
        <li class="subtask-list-element">
          <input type="checkbox" id="subtask-${index}" ${isChecked}>
          <span>${key}</span>
        </li>
      `;
    });
  }
}

function saveEditedTask(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (task) {
    task.title = document.getElementById('title').value;
    task.description = document.getElementById('description').value;
    task.date = document.getElementById('due-date').value;
    task.priority = document.querySelector('input[name="prios"]:checked').value;

    let selectedAssignees = [];
    document.querySelectorAll('input[name="assignees"]:checked').forEach(checkbox => {
      selectedAssignees.push(checkbox.value);
    });
    task.assignment = selectedAssignees.join(',');

    let subtasks = [];
    document.querySelectorAll('#subtask-list .subtask-list-element').forEach(item => {
      let subtaskText = item.querySelector('span').textContent;
      let subtaskChecked = item.querySelector('input').checked ? "done" : "open";
      subtasks.push({ [subtaskText]: subtaskChecked });
    });
    task.subtasks = JSON.stringify(subtasks);

    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    closePopup();
    renderCards();
  }
}

function closePopup() {
  document.querySelector(".popup-container").classList.remove("show");
}

function deleteTask() {
  let popup = document.getElementById("popup");
  let taskKey = popup.dataset.taskKey;

  if (confirm("Are you sure you want to delete this task?")) {
    let tasks = JSON.parse(sessionStorage.getItem("tasks"));
    delete tasks[taskKey];
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    closePopup();
    renderCards();
  }
}












