let isEditing = false;

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
    let isChecked = subtask[key] === "done" ? "checked" : "";
    subtasksList.innerHTML += `
      <div class="subtask-item">
        <input type="checkbox" class="subtask-checkbox" id="subtask-${index}" ${isChecked} disabled>
        <span class="subtask-label">${key}</span>
      </div>`;
  });
}

function editTask(taskId, idSuffix='1') {
  const popupContainer = document.querySelector('.popup-container');
  const popupContent = document.getElementById('popup');

  fetch('../templates/add-task-content.html')
    .then(response => response.text())
    .then(html => {
      popupContent.innerHTML = /*html*/`
      <button class="popup-cencel-button" onclick="closePopup()">
            <img src="../img/close.png" alt="Close" class="action-icon">
          </button>
        <form id="edit-task-form${idSuffix}" class="edit-task-form">
          <div class="d-flex-col">
            <label for="title">Title</label>
            <input type="text" id="title${idSuffix}" class="definition-entry-field" placeholder="Enter a title" required>
          </div>
          <div class="d-flex-col">
            <label for="description">Description</label>
            <textarea id="description${idSuffix}" class="definition-entry-field" placeholder="Enter a description"></textarea>
          </div>
          <div class="d-flex-col">
            <label for="due-date">Due date</label>
            <input type="date" id="due-date${idSuffix}" class="properties-entry-field" required>
          </div>
          <div class="d-flex-col">
            <label>Priority</label>
            <div id="radio-button-group-edit${idSuffix}" class="radio-button-group">
              <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button">
              <label for="prio-high" class="radio-label"><span>Urgent</span><img class="rp-prio-img" src="../img/add-task/prio-high.png"></label>
              <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button">
              <label for="prio-med" class="radio-label"><span>Medium</span><img class="rp-prio-img" src="../img/add-task/prio-med.png"></label>
              <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button">
              <label for="prio-low" class="radio-label"><span>Low</span><img class="rp-prio-img" src="../img/add-task/prio-low.png"></label>
            </div>
          </div>
          <div class="d-flex-col assignment-container">
            <label for="assignment">Select contacts to assign</label>
            <div class="select-box">
              <input id="search${idSuffix}" class="assignment-selector" type="text" placeholder="Select contacts to assign">
            </div>
            <div id="checkboxes${idSuffix}"></div>
            <div id="assigned-contacts${idSuffix}"></div>
          </div>
          <div class="d-flex-col">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
              <input type="text" id="subtasks${idSuffix}" class="properties-entry-field" placeholder="Add new subtask">
              <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
                <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button"><img src="../img/add-task/add.png"></button>
              </div>
            </div>
          </div>
          <ul id="subtask-list${idSuffix}" class="subtask-list"></ul>
        </form>
        <button class="popup-save-button" onclick="saveEditedTask('${taskId}')">
          <span class="action-label">Ok</span>
          <img src="../img/hook.png" alt="Save" class="action-icon"> 
          </button>
      `;

      populateTaskForm(taskId,idSuffix);
      popupContainer.classList.add('show');
    })
    .catch(error => console.error('Error loading Add Task form:', error));
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

function renderInfoPopup(taskId){
  return /*html*/`
  <div class="popup-header">
            <div class="tag-container" id="tag-container"><span class="tag" id="tag"></span></div>
            <button class="close-button" onclick="closePopup()"><img src="../img/close.png" alt="Close" class="close-icon" /></button>
          </div>
          <h1 class="popup-title" id="popup-title"></h1>
          <h5 class="popup-subtitle" id="popup-subtitle"></h5>
          <div class="popup-info">
            <div class="info-item-date"><span class="label">Due date:</span><span class="value" id="due-date"></span></div>
            <div id="priority-container"><span id="priority-label"></span><img id="priority-icon" /></div>
            <div class="info-item-assigned">
              <span class="label">Assigned To:</span>
              <div id="assignee-container"></div> <!-- This was added to ensure the contacts display -->
            </div>
          </div>
          <div class="popup-subtasks">
            <span class="subtasks-label">Subtasks</span>
            <div class="subtasks-list" id="subtasks-list"></div>
          </div>
          <div class="popup-actions">
            <button class="action-button" onclick="deleteTask()"><img src="../img/delete.png" alt="Delete" class="action-icon" /><span class="action-label">Delete</span></button>
            <img src="../img/high-stroke-gray.png" alt="Separator" class="action-separator" />
            <button onclick="editTask('${taskId}')"><img src="../img/edit-black.png" alt="Edit" class="action-icon" /><span class="action-label">Edit</span></button>
          </div>`;
}










