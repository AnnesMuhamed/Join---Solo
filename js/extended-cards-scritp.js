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
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks || "[]");

  if (subtasks.length === 0) {
    subtasksList.innerHTML = "<span>You have no subtasks</span>";
  } else {
    subtasks.forEach((subtask, index) => {
      let key = Object.keys(subtask)[0];
      let isChecked = subtask[key] === "done";
      let checkboxImg = isChecked ? "../assets/img/checked.png" : "../assets/img/checkbox.png";
      subtasksList.innerHTML += `
        <div class="subtask-popup ${isChecked ? 'checked' : ''}" data-subtask-id="${taskId}-${index}">
          <div class="subtask-checkbox" onclick="toggleSubtaskCheck('${taskId}', ${index});">
            <img src="${checkboxImg}" alt="Checkbox" id="checkbox-img-${taskId}-${index}">
          </div>
          <span>${key}</span>
        </div>`;
    });
  }
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
      return "../assets/img/prio-low.png";
    case "2":
      return "../assets/img/Prio media.png";
    case "3":
      return "../assets/img/prio-high.png";
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

    let contactColor = currentContact.color || "#000000";
    assigneeContainer.innerHTML += `
      <div class="assignee-undercontainer">
        <div class="assignee-initials" style="background-color:${contactColor}">
          ${getAssignedContactInitials(currentContact.firstName, currentContact.lastName)}
        </div>
        <span class="assignee-name">${currentContact.firstName} ${currentContact.lastName}</span>
      </div>`;
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
      ? "../assets/img/checked.png"
      : "../assets/img/checkbox.png";
  
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
    .then(function () {
        popupContent.innerHTML = /*html*/ `
      <button class="popup-cencel-button" onclick="closePopup()">
            <img src="../assets/img/close.png" alt="Close" class="action-icon-x">
          </button>
        <form id="edit-task-form${idSuffix}" class="edit-task-form">
          <div class="d-flex-col inpopup">
            <label class="custom-label" for="title">Title
            <span class="star">*</span>
            </label>
            <input type="text" id="title${idSuffix}" class="definition-entry-field" placeholder="Enter a title" required>
          </div>
          <div class="d-flex-col inpopup">
            <label for="description">Description</label>
            <textarea id="description${idSuffix}" class="definition-entry-field" placeholder="Enter a description"></textarea>
          </div>
          <div class="d-flex-col inpopup">
            <label class="custom-label" for="due-date">Due date
            <span class="star">*</span>
            </label>
            <input type="date" id="due-date${idSuffix}" class="properties-entry-field" required>
          </div>
          <div class="d-flex-col inpopup">
            <label>Priority</label>
            <div id="radio-button-group-edit${idSuffix}" class="radio-button-group${idSuffix}">
              <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button${idSuffix}">
              <label for="prio-high" class="radio-label${idSuffix}"><span>Urgent</span><img class="rp-prio-img" src="../assets/img/prio-high.png"></label>
              <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button${idSuffix}">
              <label for="prio-med" class="radio-label${idSuffix}"><span>Medium</span><img class="rp-prio-img" src="../assets/img/prio-med.png"></label>
              <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button${idSuffix}">
              <label for="prio-low" class="radio-label${idSuffix}"><span>Low</span><img class="rp-prio-img" src="../assets/img/prio-low.png"></label>
            </div>
          </div>
          <div class="d-flex-col assignment-container inpopup">
            <label for="assignment">Select contacts to assign</label>
            <div class="select-box">
              <input id="search1" class="assignment-selector" type="text" placeholder="Select contacts to assign" oninput="filterContacts()">
              <div id="dropdownarrow" class="dropdown-arrow" onclick="toggleCheckboxes()"></div>
              <div id="checkboxesdiv" class="d-none">
                <div id="checkboxes1" class="checkboxes-container"></div>
              </div>
            </div>
          </div>
          <div id="assigned-contacts1"></div>
          <div class="d-flex-col inpopup">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
            <input class="properties-entry-field popup-subtaskinput" type="text" id="subtask-input${idSuffix}" placeholder="Add new subtask">
          <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
          <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
            <img src="../assets/img/add.png">
          </button>
          </div>
        </div>
          </div>
          <ul id="subtask-list${idSuffix}" class="subtask-list1"></ul>
        </form>
        <button class="popup-save-button" onclick="saveEditedTask('${taskId}')">
          <span class="action-label">Ok</span>
          <img src="../assets/img/hook.png" alt="Save" class="action-icon-hook"> 
          </button>
      `;
        populateTaskForm(taskId, idSuffix);
        popupContainer.classList.add('show');
      });
}

function showSubtaskButtons(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const buttonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  if (subtaskInput.value.trim()) {
    buttonsContainer.innerHTML = `
      <button class="sutbtask-hover-btn" onclick="clearSubtaskInput('${idSuffix}')"><img src="../assets/img/close.png" alt="Save" class=""></button>
      <button class="sutbtask-hover-btn" onclick="confirmSubtask('${idSuffix}', event)"><img src="../assets/img/success.png" alt="Save" class=""> </button>
    `;
  } else {
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
  newListItem.innerHTML = `
    <span>${newSubtaskValue}</span>
    <div class="subtask-li-btn-container">
      <button class="sutbtask-hover-btn" onclick="editSubtask(this, event)">
        <img src="../assets/img/edit-black.png" alt="Edit">
      </button>
      ${verticalSeparator("1px", "24px", "#A8A8A8")}
      <button class="sutbtask-hover-btn" onclick="deleteSubtask(this)">
        <img src="../assets/img/delete.png" alt="Delete">
      </button>
    </div>
  `;

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
  saveButton.innerHTML = `<img src="../assets/img/success.png" alt="Save">`;
  saveButton.classList.add("save-button");
  saveButton.onclick = function (event) {
    event.preventDefault();
    saveSubtask(listItem, input.value);
  };

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="../assets/img/delete.png" alt="Delete">`;
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
  subtaskButtonsContainer.innerHTML = `
    <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
      <img src="../assets/img/add.png">
    </button>
  `;
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
      subtaskList.innerHTML += `
        <li class="subtask-list-element">
          <span>${key}</span>
          <div class="subtask-li-btn-container">
            <button class="sutbtask-hover-btn" onclick="editSubtask(this, '${idSuffix}')"><img src="../assets/img/edit-black.png" alt="Edit"></button>
            ${verticalSeparator("1px", "24px", "#A8A8A8")}
            <button class="sutbtask-hover-btn" onclick="deleteSubtask(this, '${idSuffix}')"><img src="../assets/img/delete.png" alt="Delete"></button>
          </div>
        </li>
      `;
    });
  }
    renderCheckboxesWithColors();
    updateAssignedContacts();
  
}

function openEditPopup(taskId) {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.innerHTML = `
    <div class="popup" id="popup">
      <form id="edit-task-form1" class="edit-task-form">
        <div id="checkboxes"></div> <!-- Erstelle den Checkboxes-Container -->
      </form>
    </div>
  `;
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

function renderInfoPopup(taskId){
  return /*html*/`
      <div class="popup-header">
            <div class="tag-container" id="tag-container"><span class="tag" id="Tag"></span></div>
            <button class="close-button" onclick="closePopup()"><img src="../assets/img/close.png" alt="Close" class="close-icon" /></button>
          </div>
          <div class="popup-info">
          <h1 class="popup-title" id="popup-title"></h1>
          <h5 class="popup-subtitle" id="popup-subtitle"></h5>
            <div class="info-item-date"><span class="label">Due date:</span><span class="value" id="due-date"></span></div>
            <div id="priority-container">
              <span class="label">Priority:</span>
              <div class="priority-lable-container">
                <span id="priority-label"></span>
                <img id="priority-icon" /></div>
              </div>
            <div class="info-item-assigned">
              <span class="label">Assigned To:</span>
              <div id="assignee-container"></div> 
              <div class="popup-subtasks">
            <span class="subtasks-label">Subtasks:</span>
            <div class="subtasks-list" id="subtasks-list"></div>
          </div>
            </div>
          </div>
          <div class="popup-actions">
            <button class="action-button" onclick="deleteTask('${taskId}')"><img src="../assets/img/delete.png" alt="Delete" class="action-icon" /><span class="action-label">Delete</span></button>
            <img src="../assets/img/high-stroke-gray.png" alt="Separator" class="action-separator" />
            <button class="action-button" onclick="editTask('${taskId}')"><img src="../assets/img/edit-black.png" alt="Edit" class="action-icon" /><span class="action-label">Edit</span></button>
        </div>`;
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

    checkboxesContainer.innerHTML += `
      <label class="popup-toggle-contacts ${isChecked ? "highlighted" : ""}" id="contact-${contactId}">
        <div class="initials-names-toggle">
          <span class="initials-span" style="background-color:${contactColor};">${initials}</span>
          <span class="popup-toggle-contact-names">${contact.firstName} ${contact.lastName}</span>
        </div>
        <input 
          type="checkbox" 
          id="checkbox-${contactId}" 
          ${isChecked ? "checked" : ""} 
          onclick="toggleContact('${contactId}')"
        />
        <div class="popup-contact-checkboxImg"></div> <!-- Benutzerspezifische Checkbox -->
      </label>
    `;
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
  listItem.innerHTML = `
    <span>${newValue}</span>
    <div class="subtask-li-btn-container">
      <button class="sutbtask-hover-btn" onclick="editSubtask(this, '1')">
        <img src="../assets/img/edit-black.png" alt="Edit">
      </button>
      ${verticalSeparator("1px", "24px", "#A8A8A8")}
      <button class="sutbtask-hover-btn" onclick="deleteSubtask(this)">
        <img src="../assets/img/delete.png" alt="Delete">
      </button>
    </div>
  `;
}

