let isEditing = false;
let initialColors = {};
let selectedContacts = new Set();

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
      return "No Priority";
  }
}

function openPopup(key) {
  document.getElementById('popup').innerHTML = renderInfoPopup(key);
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
  if (!task) {
    console.error(`Task with key ${key} not found`);
    return;
  }

  popupTitle.textContent = task.title || 'No title available';
  popupSubtitle.textContent = task.description || 'No description available';
  dueDateElement.textContent = task.date ? formatDate(task.date) : 'No due date available';

  determineTaskPriority(task, priorityLabel, priorityIcon);
  loadAssignees(task, assigneeContainer);
  loadSubtasks(task, subtasksList);

  popup.dataset.taskKey = key;
  popupContainer.classList.add("show");
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

function loadSubtasks(task, subtasksList) {
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks || "[]");
  subtasks.forEach((subtask, index) => {
    let key = Object.keys(subtask)[0];
    let isChecked = subtask[key] === "done";
    let checkboxImg = isChecked ? "../img/checked.png" : "../img/checkbox.png";
    
    subtasksList.innerHTML += `
      <div class="subtask-popup ${isChecked ? 'checked' : ''}" data-subtask-id="${index}">
        <div class="subtask-checkbox" onclick="toggleSubtaskCheck(${task.id}, ${index});">
          <img src="${checkboxImg}" alt="Checkbox" id="checkbox-img-${index}">
        </div>
        <span>${key}</span>
      </div>`;
  });
}

function toggleSubtaskCheck(taskId, subtaskIndex) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];
  let subtasks = JSON.parse(task.subtasks || "[]");
  let subtaskKey = Object.keys(subtasks[subtaskIndex])[0];
  
  subtasks[subtaskIndex][subtaskKey] = subtasks[subtaskIndex][subtaskKey] === "done" ? "not done" : "done";
  
  task.subtasks = JSON.stringify(subtasks);
  tasks[taskId] = task;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  
  let checkboxImg = subtasks[subtaskIndex][subtaskKey] === "done" ? "../img/checked.png" : "../img/checkbox.png";
  document.getElementById(`checkbox-img-${subtaskIndex}`).src = checkboxImg;

  let subtaskItem = document.querySelector(`[data-subtask-id="${subtaskIndex}"]`);
  if (subtasks[subtaskIndex][subtaskKey] === "done") {
    subtaskItem.classList.add('checked');
  } else {
    subtaskItem.classList.remove('checked');
  }
}

function openEditPopup(taskId) {
  document.getElementById('popup').innerHTML = renderEditPopupHtml(taskId);
  populateTaskForm(taskId);
  renderSubtasks(taskId); 

  document.querySelector('.popup-container').classList.add('show');
}

function renderEditPopupHtml(taskId) {
  return `
    <form id="edit-task-form">
      <div class="d-flex-col inPopup">
        <label for="subtasks">Subtasks</label>
        <div class="subtask-container">
          <input type="text" id="subtasks${taskId}" class="properties-entry-field" placeholder="Add new subtask">
          <div id="subtask-buttons-container" class="add-subtask-button">
            <button id="add-subtask-button" onclick="addSubtask('${taskId}')">Add</button>
          </div>
        </div>
      </div>
      <ul id="subtask-list${taskId}" class="subtask-list"></ul>
    </form>
  `;
}

function populateTaskForm(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];

  if (task) {
    document.getElementById(`title`).value = task.title || '';
    document.getElementById(`description`).value = task.description || '';
    document.getElementById(`due-date`).value = task.date || '';

    let priorityElement = document.querySelector(`input[name="prios"][value="${task.priority}"]`);
    if (priorityElement) priorityElement.checked = true;

    let assignees = task.assignment.split(',');
    selectedContacts = new Set(assignees);
    
    renderCheckboxesWithColors();

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

    let selectedPriority = document.querySelector('input[name="prios"]:checked');
    if (selectedPriority) {
      task.priority = selectedPriority.value;
    }

    let subtasks = [];
    document.querySelectorAll(`#subtask-list${taskId} .subtask-list-element`).forEach(item => {
      let subtaskText = item.querySelector('span').textContent;
      subtasks.push({ task: subtaskText, done: false });
    });

    task.subtasks = subtasks;
    tasks[taskId] = task;
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

function renderInfoPopup(taskId) {
  return `
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
          <img id="priority-icon" />
        </div>
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
    </div>
  `;
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

    let checkboxHTML = `
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

function getContactInitials(id) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  if (contacts[id]) {
    return `${contacts[id].firstName.charAt(0)}${contacts[id].lastName.charAt(0)}`;
  }
  return "";
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
