let isEditing = false;
let initialColors = {};
let selectedContacts = new Set();

function getHtmlElements() {
  let popupContainer = document.querySelector(".popup-container");
  let popup = document.getElementById("popup");
  let popupTag = document.getElementById('tag-container');
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
      return "No Priority";
  }
}

function openPopup(key) {
  document.getElementById('popup').innerHTML = renderInfoPopup(key);
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

  let task = getTask(key);
  if (!task) {
    console.error(`Task with key ${key} not found`);
    return;
  }

  if (popupTag) {
    popupTag.textContent = task.category;
  }

  if (popupTitle) {
    popupTitle.textContent = task.title || 'No title available';
  }

  if (popupSubtitle) {
    popupSubtitle.textContent = task.description || 'No description available';
  }

  if (dueDateElement) {
    dueDateElement.textContent = task.date ? formatDate(task.date) : 'No due date available';
  }

  getPopupTagColor(task, popupTag);
  determineTaskPriority(task, priorityLabel, priorityIcon);
  loadAssignees(task, assigneeContainer);
  loadSubtasks(task, subtasksList, key);

  popup.dataset.taskKey = key;
  popupContainer.classList.add("show");
}

function getPopupTagColor(task, popupTag) {
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

function loadSubtasks(task, subtasksList, taskId) {
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks || "[]");
  if (subtasks.length === 0) {
    subtasksList.innerHTML = "<span>You have no subtasks</span>";
  } else {
    subtasks.forEach((subtask, index) => {
      let key = Object.keys(subtask)[0];
      let isChecked = subtask[key] === "done";
      let checkboxImg = isChecked ? "../img/checked.png" : "../img/checkbox.png";
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

function toggleSubtaskCheck(taskId, subtaskIndex) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];
  if (!task) {
    console.error(`Task with ID ${taskId} not found`);
    return;
  }
  
  let subtasks = JSON.parse(task.subtasks || "[]");
  let subtaskKey = Object.keys(subtasks[subtaskIndex])[0];
  subtasks[subtaskIndex][subtaskKey] = subtasks[subtaskIndex][subtaskKey] === "done" ? "open" : "done";
  task.subtasks = JSON.stringify(subtasks);
  tasks[taskId] = task;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  updateData(`tasks/${taskId}`, task);
  let checkboxImg = subtasks[subtaskIndex][subtaskKey] === "done" ? "../img/checked.png" : "../img/checkbox.png";
  let checkboxElement = document.getElementById(`checkbox-img-${taskId}-${subtaskIndex}`);

  if (checkboxElement) {
    checkboxElement.src = checkboxImg;
    let subtaskItem = document.querySelector(`[data-subtask-id="${taskId}-${subtaskIndex}"]`);
    if (subtasks[subtaskIndex][subtaskKey] === "done") {
      subtaskItem.classList.add('checked');
    } else {
      subtaskItem.classList.remove('checked');
    }
    updateProgressBar(taskId);
    renderCards();
  } else {
    console.error(`Checkbox element with ID checkbox-img-${taskId}-${subtaskIndex} not found`);
  }
}

function createOrUpdateProgressBar(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (!task) {
    console.error(`Task with ID ${taskId} not found for progress update`);
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
      progressBarContainer.className = 'progress-container';
      subtaskContainer.appendChild(progressBarContainer);
    }

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = `${taskId}-progress-bar`;
      progressBar.className = 'progress-bar';
      progressBarContainer.appendChild(progressBar);
    }

    if (!progressLabel) {
      progressLabel = document.createElement('span');
      progressLabel.id = `${taskId}-subtask-counter`;
      progressLabel.className = 'subtask-counter';
      progressBarContainer.appendChild(progressLabel);
    }
  }
  updateProgressBar(taskId);
}

function updateProgressBar(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (task && task.subtasks) {
    let subtasks = JSON.parse(task.subtasks);
    let totalSubtasks = subtasks.length;
    let completedSubtasks = subtasks.filter(subtask => {
      let key = Object.keys(subtask)[0];
      return subtask[key] === "done";
    }).length;

    let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    let progressBar = document.querySelector(`#${taskId}-progress-bar`);
    let progressLabel = document.querySelector(`#${taskId}-subtask-counter`);

    if (progressBar && progressLabel) {
      progressBar.style.width = `${progress}%`;
      progressLabel.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;

      if (totalSubtasks === 0) {
        progressBar.style.display = "none";
      } else {
        progressBar.style.display = "block";
      }
    } else {
      console.error(`Progress bar or label not found for task ID: ${taskId}`);
    }
  }
}

function editTask(taskId, idSuffix = '1') {
  const popupContainer = document.querySelector('.popup-container');
  const popupContent = document.getElementById('popup');

  fetch('../templates/add-task-content.html')
    .then(response => response.text())
    .then(function () {
        popupContent.innerHTML = /*html*/ `
      <button class="popup-cencel-button" onclick="closePopup()">
            <img src="../img/close.png" alt="Close" class="action-icon-x">
          </button>
        <form id="edit-task-form${idSuffix}" class="edit-task-form">
          <div class="d-flex-col inPopup">
            <label class="custom-label" for="title">Title
            <span class="star">*</span>
            </label>
            <input type="text" id="title${idSuffix}" class="definition-entry-field" placeholder="Enter a title" required>
          </div>
          <div class="d-flex-col inPopup">
            <label for="description">Description</label>
            <textarea id="description${idSuffix}" class="definition-entry-field" placeholder="Enter a description"></textarea>
          </div>
          <div class="d-flex-col inPopup">
            <label class="custom-label" for="due-date">Due date
            <span class="star">*</span>
            </label>
            <input type="date" id="due-date${idSuffix}" class="properties-entry-field" required>
          </div>
          <div class="d-flex-col inPopup">
            <label>Priority</label>
            <div id="radio-button-group-edit${idSuffix}" class="radio-button-group${idSuffix}">
              <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button${idSuffix}">
              <label for="prio-high" class="radio-label${idSuffix}"><span>Urgent</span><img class="rp-prio-img" src="../img/add-task/prio-high.png"></label>
              <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button${idSuffix}">
              <label for="prio-med" class="radio-label${idSuffix}"><span>Medium</span><img class="rp-prio-img" src="../img/add-task/prio-med.png"></label>
              <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button${idSuffix}">
              <label for="prio-low" class="radio-label${idSuffix}"><span>Low</span><img class="rp-prio-img" src="../img/add-task/prio-low.png"></label>
            </div>
          </div>
          <div class="d-flex-col assignment-container inPopup">
            <label for="assignment">Select contacts to assign</label>
            <div class="select-box">
              <input id="search1" class="assignment-selector" type="text" placeholder="Select contacts to assign" oninput="filterContacts()">
              <div id="dropdownArrow" class="dropdown-arrow" onclick="toggleCheckboxes()"></div>
              <div id="checkboxesDiv" class="d-none">
                <div id="checkboxes1" class="checkboxes-container"></div>
              </div>
            </div>
          </div>
          <div id="assigned-contacts1"></div>
          <div class="d-flex-col inPopup">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
            <input class="properties-entry-field popup-subtaskinput" type="text" id="subtask-input${idSuffix}" placeholder="Add new subtask">
          <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
          <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
            <img src="../img/add-task/add.png">
          </button>
          </div>
        </div>
          </div>
          <ul id="subtask-list${idSuffix}" class="subtask-list1"></ul>
        </form>
        <button class="popup-save-button" onclick="saveEditedTask('${taskId}')">
          <span class="action-label">Ok</span>
          <img src="../img/hook.png" alt="Save" class="action-icon-hook"> 
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
      <button class="sutbtask-hover-btn" onclick="clearSubtaskInput('${idSuffix}')"><img src="../img/close.png" alt="Save" class=""></button>
      <button class="sutbtask-hover-btn" onclick="confirmSubtask('${idSuffix}', event)"><img src="../img/success.png" alt="Save" class=""> </button>
    `;
  } else {
    console.log("No subtask input provided.");
  }
}

function confirmSubtask(idSuffix, event) {
  event.preventDefault(); 

  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const subtaskList = document.getElementById(`subtask-list${idSuffix}`);

  if (subtaskInput.value.trim()) {
    let newListItem = document.createElement('li');
    newListItem.classList.add('subtask-list-element');
    newListItem.innerHTML = `
      <span>${subtaskInput.value}</span>
      <div class="subtask-li-btn-container">
        <button class="sutbtask-hover-btn" onclick="editSubtask(this, '${idSuffix}')"><img src="../img/edit-black.png" alt="Edit"></button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="sutbtask-hover-btn" onclick="deleteSubtask(this, '${idSuffix}')"><img src="../img/delete.png" alt="Delete"></button>
      </div>
    `;
    subtaskList.appendChild(newListItem); 
    subtaskInput.value = "";
    resetSubtaskButtons(idSuffix);
  } else {
    console.log("No subtask input provided.");
  }
}

function editSubtask(button, idSuffix) {
  const listItem = button.closest('li');
  listItem.classList.add('editing'); 
  
  const subtaskText = listItem.querySelector('span').textContent;
  const inputContainer = document.createElement("div");

  inputContainer.classList.add('input-container');
  const input = document.createElement("input");
  input.type = "text";
  input.value = subtaskText; 
  input.classList.add("edit-input");
  const saveButton = document.createElement("button");
  saveButton.innerHTML = `<img src="../img/success.png" alt="Save">`;
  saveButton.classList.add("save-button");
  saveButton.onclick = function (event) {
    event.preventDefault();
    saveSubtask(listItem, input.value);
  };

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="../img/delete.png" alt="Delete">`;
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = function () {
    deleteSubtask(listItem);
  };
  inputContainer.appendChild(input);
  inputContainer.appendChild(saveButton);
  inputContainer.appendChild(deleteButton);
  listItem.innerHTML = "";
  listItem.appendChild(inputContainer);
  input.focus();
}

function saveSubtask(listItem, newValue) {
  if (newValue.trim()) {
    listItem.classList.remove('editing');
    listItem.innerHTML = `
      <span>${newValue}</span>
      <div class="subtask-li-btn-container">
        <button class="sutbtask-hover-btn" onclick="editSubtask(this)"><img src="../img/edit-black.png" alt="Edit"></button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="sutbtask-hover-btn" onclick="deleteSubtask(this)"><img src="../img/delete.png" alt="Delete"></button>
      </div>
    `;
  }
}

function deleteSubtask(button) {
  const listItem = button.parentNode.parentNode;
  listItem.remove();
}

function resetSubtaskButtons(idSuffix) {
  const buttonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  buttonsContainer.innerHTML = `
    <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
      <img src="../img/add-task/add.png">
    </button>`;
}

function clearSubtaskInput(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  subtaskInput.value = "";
  resetSubtaskButtons(idSuffix);
}

function populateTaskForm(taskId, idSuffix) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (task) {
    document.getElementById(`title${idSuffix}`).value = task.title || '';
    document.getElementById(`description${idSuffix}`).value = task.description || '';
    document.getElementById(`due-date${idSuffix}`).value = task.date || '';

    let priorityElement = document.querySelector(`input[name="prios"][value="${task.priority}"]`);
    if (priorityElement) priorityElement.checked = true;

    let assignees = task.assignment ? task.assignment.split(',') : [];
    selectedContacts = new Set(assignees);

    renderCheckboxesWithColors();
    updateAssignedContacts();

    let subtasks = JSON.parse(task.subtasks || "[]");
    let subtaskList = document.getElementById('subtask-list1');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
      let key = Object.keys(subtask)[0];
      subtaskList.innerHTML += `
        <li class="subtask-list-element">
          <span>${key}</span>
          <div class="subtask-li-btn-container">
            <button class="sutbtask-hover-btn" onclick="editSubtask(this, '${idSuffix}')"><img src="../img/edit-black.png" alt="Edit"></button>
            ${verticalSeparator("1px", "24px", "#A8A8A8")}
            <button class="sutbtask-hover-btn" onclick="deleteSubtask(this, '${idSuffix}')"><img src="../img/delete.png" alt="Delete"></button>
          </div>
        </li>
      `;
    });
  }
}

function renderCards() {
  let tasks = JSON.parse(sessionStorage.getItem('tasks')); 
  let boardContainer = document.getElementById('board-container');
  boardContainer.innerHTML = '';

  for (let taskId in tasks) {
    let task = tasks[taskId];
    let taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Due date: ${task.date}</p>
      <p>Priority: ${getPriorityLabel(task.priority)}</p>
      <button onclick="openPopup('${taskId}')">Edit</button>
    `;
    boardContainer.appendChild(taskCard);
  }
}

async function saveEditedTask(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (!task) {
    console.error(`Task mit ID ${taskId} wurde nicht gefunden!`);
    return;
  }

  let titleInput = document.getElementById('title1');
  let descriptionInput = document.getElementById('description1');
  let dateInput = document.getElementById('due-date1');
  let priorityInput = document.querySelector('input[name="prios"]:checked');
  if (titleInput) {
    task.title = titleInput.value.trim() !== "" ? titleInput.value : task.title;
  }
  if (descriptionInput) {
    task.description = descriptionInput.value.trim() !== "" ? descriptionInput.value : task.description;
  }
  if (dateInput) {
    task.date = dateInput.value.trim() !== "" ? dateInput.value : task.date;
  }
  if (priorityInput) {
    task.priority = priorityInput.value;
  }

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
    console.error(`Fehler beim Aktualisieren der Task in Firebase: ${error}`);
  }
  renderCards();
  closePopup();
  createOrUpdateProgressBar(taskId);
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

function renderInfoPopup(taskId){
  return /*html*/`
      <div class="popup-header">
            <div class="tag-container" id="tag-container"><span class="tag" id="tag"></span></div>
            <button class="close-button" onclick="closePopup()"><img src="../img/close.png" alt="Close" class="close-icon" /></button>
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
            <button class="action-button" onclick="deleteTask()"><img src="../img/delete.png" alt="Delete" class="action-icon" /><span class="action-label">Delete</span></button>
            <img src="../img/high-stroke-gray.png" alt="Separator" class="action-separator" />
            <button class="action-button" onclick="editTask('${taskId}')"><img src="../img/edit-black.png" alt="Edit" class="action-icon" /><span class="action-label">Edit</span></button>
        </div>`;
}

function toggleCheckboxes() {
  const checkboxesDiv = document.getElementById("checkboxesDiv");
  const dropdownArrow = document.getElementById("dropdownArrow");

  if (checkboxesDiv.classList.contains("d-none")) {
    checkboxesDiv.classList.remove("d-none");
    dropdownArrow.classList.add("active");  
  } else {
    checkboxesDiv.classList.add("d-none"); 
    dropdownArrow.classList.remove("active");
  }
  renderCheckboxes();
}

function renderCheckboxesWithColors() {
  let contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  let checkboxes = document.getElementById("checkboxes1");
  checkboxes.innerHTML = "";

  for (let id in contacts) {
    let contact = contacts[id];
    let initials = getContactInitials(id); 
    let isChecked = selectedContacts.has(id);

    if (!initialColors[id]) {
      initialColors[id] = getRandomColor();
    }
    let randomColor = initialColors[id];
    let checkboxHTML = /*html*/` 
      <label class="popup-toggle-contacts ${isChecked ? 'highlighted' : ''}" onclick="popupHighlightContact(this, '${id}');">
        <div class="initials-names-toggle">
          <span class="initials-span" id="initials-${id}" style="background-color:${randomColor};">${initials}</span>
          <span class="popup-toggle-contact-names">${contact.firstName} ${contact.lastName}</span>
        </div>
        <input type="checkbox" id="checkbox-${id}" ${isChecked ? 'checked' : ''} style="display:none;">
        <span class="popup-contact-checkboxImg ${isChecked ? 'checked' : ''}" id="checkbox-img-${id}"></span>
      </label>`;
    checkboxes.innerHTML += checkboxHTML;
  }
}

function toggleContactCheck(contactId) {
  const checkbox = document.getElementById(`checkbox-${contactId}`);
  checkbox.checked = !checkbox.checked;  
  if (checkbox.checked) {
    selectedContacts.push(contactId); 
  } else {
    selectedContacts = selectedContacts.filter(id => id !== contactId);
  }
  updateAssignedContacts();
}

function popupHighlightContact(element, contactId) {
  const checkbox = document.getElementById(`checkbox-${contactId}`);
  const checkboxImg = document.getElementById(`checkbox-img-${contactId}`);
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    selectedContacts.add(contactId);
    element.classList.add('highlighted'); 
    checkboxImg.classList.add('checked');
  } else {
    selectedContacts.delete(contactId);
    element.classList.remove('highlighted'); 
    checkboxImg.classList.remove('checked'); 
  }
  updateAssignedContacts();
}

function updateAssignedContacts() {
  const assignedDiv = document.getElementById("assigned-contacts1");
  let contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};

  assignedDiv.innerHTML = "";

  selectedContacts.forEach(id => {
    const contact = contacts[id];
    if (contact) {
      let initials = getContactInitials(id);
      let assignedColor = initialColors[id];  

      assignedDiv.innerHTML += `<span class="initials-popup-span" id="assigned-${id}" style="background-color:${assignedColor};">${initials}</span>`;
    }
  });
}

function getContactInitials(id) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  if (contacts[id]) {
    return `${contacts[id].firstName.charAt(0)}${contacts[id].lastName.charAt(0)}`;
  }
  return "";
} 
