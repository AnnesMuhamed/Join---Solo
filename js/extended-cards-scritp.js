let isEditing = false;
let initialColors = {};
let selectedContacts = new Set();

function getHtmlElements() {
  const popupContainer = document.querySelector(".popup-container");
  const popup = document.getElementById("popup");
  const popupTag = document.getElementById("tag-container");
  const popupTitle = document.getElementById("popup-title");
  const popupSubtitle = document.getElementById("popup-subtitle");
  const dueDateElement = document.getElementById("due-date");
  const priorityLabel = document.getElementById("priority-label");
  const priorityIcon = document.getElementById("priority-icon");
  const assigneeContainer = document.getElementById("assignee-container");
  const subtasksList = document.getElementById("subtasks-list");

  return [
    popupContainer,
    popup,
    popupTag,
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
  return tasks ? tasks[key] : undefined;
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
      return "No Priority";
  }
}

function openPopup(key) {
  let task = getTask(key);
  if (!task) {
    return;
  }

  const popupHtml = renderInfoPopup(key);
  document.getElementById("popup").innerHTML = popupHtml;

  let [
    popupContainer,
    popup,
    popupTag,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ] = getHtmlElements();

  if (!popup) {
    return;
  }

  if (popupTag) popupTag.textContent = task.category || 'Keine Kategorie';
  if (popupTitle) popupTitle.textContent = task.title || 'Kein Titel';
  if (popupSubtitle) popupSubtitle.textContent = task.description || 'Keine Beschreibung';
  if (dueDateElement) dueDateElement.textContent = task.date ? formatDate(task.date) : 'Kein Fälligkeitsdatum';

  getPopupTagColor(task, popupTag);
  determineTaskPriority(task, priorityLabel, priorityIcon);
  loadAssignees(task, assigneeContainer);
  loadSubtasks(task, subtasksList, key);

  popupContainer.classList.add("show");
}

function loadSubtasks(task, subtasksList, taskId) {
  subtasksList.innerHTML = generateSubtaskListTemplate(task, taskId);
}

function getPopupTagColor(task, popupTag) {
  if (!popupTag) {
    return;
  }

  popupTag.classList.remove("user-story", "technical-task");
  if (task.category === "User Story") {
    popupTag.classList.add("user-story");
  } else if (task.category === "Technical Task") {
    popupTag.classList.add("technical-task");
  }
}

function formatDate(dateString) {
  if (!dateString) return 'No due date';

  let date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';

  let day = String(date.getDate()).padStart(2, '0'); 
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function determineTaskPriority(task, priorityLabel, priorityIcon) {
  if (!priorityLabel || !priorityIcon) {
    return;
  }

  if (task.priority) {
    priorityLabel.textContent = getPriorityLabel(task.priority);
    priorityIcon.src = getPriorityIcon(task.priority);

    if (priorityIcon.classList) {
      priorityIcon.classList.remove("d-none");
    }
  } else {
    priorityLabel.textContent = "No Priority";

    if (priorityIcon.classList) {
      priorityIcon.classList.add("d-none");
    }
  }
}

function getPriorityIcon(priority) {
  switch (priority) {
    case "1":
      return "./assets/img/prio-low.png";
    case "2":
      return "./assets/img/Prio media.png";
    case "3":
      return "./assets/img/prio-high.png";
    default:
      return "";
  }
}

function getAssignedContactInitials(firstName, lastName) {
  if (!firstName || !lastName) {
    return "??";
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

function loadAssignees(task, assigneeContainer) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  assigneeContainer.innerHTML = "";

  if (!contacts) {
    return;
  }

  let assignedContacts = task.assignment ? task.assignment.split(",") : [];
  assignedContacts.forEach((contactId) => {
    let currentContact = contacts[contactId];

    if (!currentContact) {
      return;
    }

    assigneeContainer.innerHTML += generateAssigneeTemplate(currentContact);
  });
}

function toggleSubtaskCheck(taskId, subtaskIndex) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (!task) {
      return;
  }

  let subtasks = JSON.parse(task.subtasks || "[]");
  let subtaskKey = Object.keys(subtasks[subtaskIndex])[0];
  subtasks[subtaskIndex][subtaskKey] = subtasks[subtaskIndex][subtaskKey] === "done" ? "open" : "done";

  task.subtasks = JSON.stringify(subtasks);
  tasks[taskId] = task;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));

  let checkboxImg = subtasks[subtaskIndex][subtaskKey] === "done"
      ? "./assets/img/checked.png"
      : "./assets/img/checkbox.png";
  
  let checkboxElement = document.getElementById(`checkbox-img-${taskId}-${subtaskIndex}`);
  if (checkboxElement) {
      checkboxElement.src = checkboxImg;
      updateProgressBar(taskId);
  }

  renderCards();
}

function createOrUpdateProgressBar(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (!task) {
    return;
  }

  let progressBarContainer = document.querySelector(`#${taskId}-progress`);
  let progressBar = document.querySelector(`#${taskId}-progress-bar`);
  let progressLabel = document.querySelector(`#${taskId}-subtask-counter`);

  if (!progressBarContainer || !progressBar || !progressLabel) {
    let subtaskContainer = document.querySelector(`#${taskId}-subtask`);

    if (!progressBarContainer) {
      progressBarContainer = document.createElement('div');
      progressBarContainer.id = `${taskId}-progress`;
      progressBarContainer.classname = 'progress-container';
      subtaskContainer.appendChild(progressBarContainer);
    }

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = `${taskId}-progress-bar`;
      progressBar.classname = 'progress-bar';
      progressBarContainer.appendChild(progressBar);
    }

    if (!progressLabel) {
      progressLabel = document.createElement('span');
      progressLabel.id = `${taskId}-subtask-counter`;
      progressLabel.classname = 'subtask-counter';
      progressBarContainer.appendChild(progressLabel);
    }
  }
  updateProgressBar(taskId);
}

function updateProgressBar(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (!task || !task.subtasks) {
      return;
  }

  let subtasks = JSON.parse(task.subtasks);
  let total = subtasks.length;
  let completed = subtasks.filter(subtask => Object.values(subtask)[0] === "done").length;

  let progress = total > 0 ? (completed / total) * 100 : 0;

  let progressBar = document.querySelector(`#${taskId}-progress-bar`);
  let progressLabel = document.querySelector(`#${taskId}-subtask-counter`);

  if (progressBar && progressLabel) {
      progressBar.style.width = `${progress}%`;
      progressLabel.textContent = `${completed}/${total} Subtasks`;
  }
}

function editTask(taskId, idSuffix = '1') {
  const popupContainer = document.querySelector('.popup-container');
  const popupContent = document.getElementById('popup');

  fetch('add-task-content.html')
    .then(response => response.text())
    .then(() => {
      popupContent.innerHTML = editTaskInnerHTML(taskId, idSuffix);
    })
    .then(() => {
      if (document.getElementById(`title${idSuffix}`)) {
        populateTaskForm(taskId, idSuffix);
        popupContainer.classList.add('show');
      } else {
        console.error("HTML-Elemente nicht gefunden!");
      }
    });
}

function showSubtaskButtons(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const buttonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  if (subtaskInput.value.trim()) {
    buttonsContainer.innerHTML = generateSubtaskButtonsTemplate(idSuffix);
  } else {
    resetSubtaskButtons(idSuffix);
  }
}

function confirmSubtask(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const subtaskList = document.getElementById(`subtask-list${idSuffix}`);
  const newSubtaskValue = subtaskInput.value.trim();
  if (newSubtaskValue === "") {
    return;
  }

  const newListItem = document.createElement("li");
  newListItem.classList.add("subtask-list-element");
  newListItem.innerHTML = generateSubtaskHTML(newSubtaskValue, idSuffix);

  subtaskList.appendChild(newListItem);
  subtaskInput.value = "";
  resetSubtaskButtons(idSuffix);
}

function editSubtask(button) {
  const listItem = button.closest('li');
  if (!listItem) {
    return;
  }

  listItem.classList.add('editing');
  const subtaskText = listItem.querySelector('span').textContent;
  const inputContainer = document.createElement("div");
  inputContainer.classList.add('input-container');
  const input = document.createElement("input");
  input.type = "text";
  input.value = subtaskText; 
  input.classList.add("edit-input");
  const saveButton = document.createElement("button");
  saveButton.innerHTML = `<img src="./assets/img/success.png" alt="Save">`;
  saveButton.classList.add("save-button");
  saveButton.onclick = function (event) {
    event.preventDefault();
    saveSubtask(listItem, input.value);
  };

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="./assets/img/delete.png" alt="Delete">`;
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = function (event) {
    event.preventDefault();
    deleteSubtask(button);
  };

  inputContainer.appendChild(input);
  inputContainer.appendChild(saveButton);
  inputContainer.appendChild(deleteButton);
  listItem.innerHTML = "";
  listItem.appendChild(inputContainer);
  input.focus();
}

function deleteSubtask(button, event) {
  if (event) event.preventDefault();

  const listItem = button.closest('li');
  if (!listItem) {
    return;
  }

  listItem.remove();
}

function resetSubtaskButtons(idSuffix) {
  const subtaskButtonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  subtaskButtonsContainer.innerHTML = generateSubtaskButtonTemplate(idSuffix);
}

function clearSubtaskInput(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  subtaskInput.value = "";
  resetSubtaskButtons(idSuffix);
}

function populateTaskForm(taskId, idSuffix) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks ? tasks[taskId] : null;

  if (!task) {
    return;
  }

  document.getElementById(`title${idSuffix}`).value = task.title || '';
  document.getElementById(`description${idSuffix}`).value = task.description || '';
  document.getElementById(`due-date${idSuffix}`).value = task.date || '';

  let priorityElement = document.querySelector(`input[name="prios"][value="${task.priority}"]`);
  if (priorityElement) {
    priorityElement.checked = true;
  }

  let assignees = task.assignment ? task.assignment.split(',') : [];
  selectedContacts = new Set(assignees);
  let subtasks = JSON.parse(task.subtasks || "[]");
  let subtaskList = document.getElementById('subtask-list1');
  if (subtaskList) {
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
      let key = Object.keys(subtask)[0];
      subtaskList.innerHTML += generateSubtaskItemTemplate(key, idSuffix);
    });
  }

  renderCheckboxesWithColors();
  updateAssignedContacts();
}

function openEditPopup(taskId) {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.innerHTML = generateEditPopupTemplate();
  populateTaskForm(taskId, '1');
}

async function loadContacts() {
  contacts = await loadData(pathContacts);

  if (contacts) {
    setTimeout(() => {
      renderCheckboxesWithColors();t
    }, 0);
  }
}

function renderCards() {
  let tasks = JSON.parse(sessionStorage.getItem("tasks")) || {};
  let allTaskCardsContainer = document.querySelectorAll(".drag-area");

  if (!allTaskCardsContainer || allTaskCardsContainer.length === 0) {
      return;
  }

  allTaskCardsContainer.forEach((column) => {
      if (column) {
          column.innerHTML = ""; 
      }
  });

  Object.keys(tasks).forEach((key) => {
      let task = tasks[key];
      let stateColumn = document.getElementById(task.state);

      if (stateColumn) {
          createCard(key, stateColumn, task);
      }
  });
}

async function saveEditedTask(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks ? tasks[taskId] : null;

  if (!task) {
    return;
  }

  let titleInput = document.getElementById('title1');
  let descriptionInput = document.getElementById('description1');
  let dateInput = document.getElementById('due-date1');
  let priorityInput = document.querySelector('input[name="prios"]:checked');

  if (titleInput) task.title = titleInput.value.trim() !== "" ? titleInput.value : task.title;
  if (descriptionInput) task.description = descriptionInput.value.trim() !== "" ? descriptionInput.value : task.description;
  if (dateInput) task.date = dateInput.value.trim() !== "" ? dateInput.value : task.date;
  if (priorityInput) task.priority = priorityInput.value;

  let selectedAssignees = Array.from(selectedContacts);
  task.assignment = selectedAssignees.length > 0 ? selectedAssignees.join(',') : "";

  let subtasks = [];
  document.querySelectorAll('#subtask-list1 .subtask-list-element').forEach(item => {
    let subtaskText = item.querySelector('span').textContent;
    let subtaskChecked = "open";
    subtasks.push({ [subtaskText]: subtaskChecked });
  });
  task.subtasks = JSON.stringify(subtasks);

  tasks[taskId] = task;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));

  try {
    await updateData(`tasks/${taskId}`, task);
  } catch (error) {
    console.error(`Fehler beim Aktualisieren der Aufgabe in Firebase: ${error}`);
  }
  renderCards();
  closePopup();
  createOrUpdateProgressBar(taskId);
}

function closePopup() {
  document.getElementById('popup-container').classList.remove('show');
}

async function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
      try {
          await deleteData(`tasks/${taskId}`);
          let tasks = JSON.parse(sessionStorage.getItem("tasks"));
          delete tasks[taskId];
          sessionStorage.setitem("tasks", JSON.stringify(tasks));
          closePopup();
          renderCards();
      } catch (error) {
          console.error("Fehler beim Löschen der Aufgabe:", error);
      }
  }
}

function toggleCheckboxes() {
  const checkboxes = document.getElementById("checkboxesdiv");

  if (!checkboxes) {
    return;
  }

  if (checkboxes.classList.contains("d-none")) {
    checkboxes.classList.remove("d-none"); 
  } else {
    checkboxes.classList.add("d-none");
  }
}

function renderCheckboxesWithColors() {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const checkboxesContainer = document.getElementById("checkboxes1");

  if (!checkboxesContainer) {
    return;
  }

  checkboxesContainer.innerHTML = "";

  Object.keys(contacts).forEach(contactId => {
    const contact = contacts[contactId];
    const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
    const isChecked = selectedContacts.has(contactId);
    const contactColor = contact.color || "#000000";

    checkboxesContainer.innerHTML += renderCheckboxTemplate(contactId, initials, contactColor, isChecked, contact);
  });
}

function toggleContact(contactId) {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contactLabel = document.getElementById(`contact-${contactId}`);
  const checkbox = document.getElementById(`checkbox-${contactId}`);
  
  if (!contacts[contactId]) {
    return;
  }

  const isSelected = selectedContacts.has(contactId);

  if (isSelected) {
    selectedContacts.delete(contactId);
    contactLabel.classList.remove("highlighted");
    if (checkbox) checkbox.checked = false;
    removeContactFromAssigned(contactId);
  } else {
    selectedContacts.add(contactId);
    contactLabel.classList.add("highlighted");
    if (checkbox) checkbox.checked = true;
    addContactToAssigned(contactId);
  }
  updateAssignedContacts();
}

function addContactToAssigned(contactId) {
  const assignedDiv = document.getElementById("assigned-contacts1");
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contact = contacts[contactId];

  if (!contact) {
    return;
  }

  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const assignedColor = contact.color || "#000000";
  const span = document.createElement("span");
  span.classList.add("initials-popup-span");
  span.id = `assigned-${contactId}`;
  span.style.backgroundColor = assignedColor;
  span.textContent = initials;

  assignedDiv.appendChild(span);
}

function removeContactFromAssigned(contactId) {
  const span = document.getElementById(`assigned-${contactId}`);
  if (span) {
    span.remove();
  }
}

function updateAssignedContacts() {
  const assignedDiv = document.getElementById("assigned-contacts1");
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  assignedDiv.innerHTML = "";
  selectedContacts.forEach(contactId => {
    const contact = contacts[contactId];
    if (contact) {
      const initials = getContactInitials(contactId);
      const assignedColor = contact.color || "#000000";

      const span = document.createElement("span");
      span.classList.add("initials-popup-span");
      span.id = `assigned-${contactId}`;
      span.style.backgroundColor = assignedColor;
      span.textContent = initials;

      assignedDiv.appendChild(span);
    }
  });
}

function getContactInitials(contactId) {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contact = contacts[contactId];

  if (!contact || !contact.firstName || !contact.lastName) {
    return "??"; 
  }

  return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
}

function saveSubtask(listItem, newValue) {
  if (!listItem) {
    return;
  }

  if (newValue.trim() === "") {
    return;
  }

  listItem.classList.remove('editing');
  listItem.innerHTML = subtaskTemplate(newValue);
}


