let isEditing = false;
let initialColors = {};
let selectedContacts = new Set();

// ÖFFNEN
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

// ÖFFNEN
function getTask(key) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  return tasks ? tasks[key] : undefined;
}

// ÖFFNEN
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

// ÖFFNEN
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

// ÖFFNEN
function loadSubtasks(task, subtasksList, taskId) {
  subtasksList.innerHTML = generateSubtaskListTemplate(task, taskId);
}

// ÖFFNEN
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

// ÖFFNEN
function formatDate(dateString) {
  if (!dateString) return 'No due date';

  let date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';

  let day = String(date.getDate()).padStart(2, '0'); 
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

// ÖFFNEN
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

// ÖFFNEN
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