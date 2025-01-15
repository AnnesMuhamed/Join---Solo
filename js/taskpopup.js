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

/**
 * Retrieves a specific task from sessionStorage based on the provided key.
 * 
 * @param {string} key - The key or ID of the task to retrieve.
 * @returns {Object|undefined} - The task object if found, or undefined if the task does not exist.
 */
function getTask(key) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  return tasks ? tasks[key] : undefined;
}

/**
 * Returns the textual label corresponding to the given priority level.
 * 
 * @param {string} priority - The priority level ("1", "2", "3").
 * @returns {string} - The label for the priority level ("Low", "Medium", "High"), 
 * or "No Priority" if the priority level is invalid or undefined.
 */
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

/**
 * Returns the file path of the icon corresponding to the given priority level.
 * 
 * @param {string} priority - The priority level ("1", "2", "3").
 * @returns {string} - The file path of the priority icon, or an empty string if the priority is invalid or undefined.
 */
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

/**
 * Opens a popup to display detailed information about a task, 
 * populating the popup with the task's data and showing it on the screen.
 * 
 * @param {string} key - The key or ID of the task to display in the popup.
 */
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

/**
 * Loads the subtasks of a task into the specified subtasks list element 
 * by generating the HTML template for the subtasks.
 * 
 * @param {Object} task - The task object containing the subtasks.
 * @param {HTMLElement} subtasksList - The HTML element where the subtasks will be displayed.
 * @param {string} taskId - The ID of the task whose subtasks are being loaded.
 */
function loadSubtasks(task, subtasksList, taskId) {
  subtasksList.innerHTML = generateSubtaskListTemplate(task, taskId);
}

/**
 * Sets the color of the popup tag based on the task's category by adding 
 * the appropriate CSS class to the tag element.
 * 
 * @param {Object} task - The task object containing the category information.
 * @param {HTMLElement} popupTag - The HTML element representing the popup tag.
 */
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

/**
 * Formats a date string into the format "DD.MM.YYYY". If the date is invalid or missing, 
 * it returns an appropriate fallback message.
 * 
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date in "DD.MM.YYYY" format, or a fallback message if invalid or missing.
 */
function formatDate(dateString) {
  if (!dateString) return 'No due date';

  let date = new Date(dateString);
  if (isNaN(date)) return 'Invalid date';

  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

/**
 * Sets the task's priority in the popup by updating the priority label and icon 
 * based on the task's priority value. If no priority is set, a default message 
 * and styling are applied.
 * 
 * @param {Object} task - The task object containing the priority information.
 * @param {HTMLElement} priorityLabel - The HTML element for displaying the priority label.
 * @param {HTMLImageElement} priorityIcon - The HTML element for displaying the priority icon.
 */
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

/**
 * Generates the initials of a contact based on their first and last name.
 * If either the first or last name is missing, returns "??".
 * 
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @returns {string} - The initials of the contact or "??" if either name is missing.
 */
function getAssignedContactInitials(firstName, lastName) {
  if (!firstName || !lastName) {
      return "??";
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

/**
 * Loads the assigned contacts for a task and displays them in the specified container.
 * Generates the HTML for each assigned contact using a template.
 * 
 * @param {Object} task - The task object containing the assigned contacts.
 * @param {HTMLElement} assigneeContainer - The HTML element where assigned contacts will be displayed.
 */
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

/**
 * Toggles the completion state of a specific subtask for a given task, updates the task's subtasks in sessionStorage,
 * updates the UI for the subtask's checkbox, and refreshes the progress bar and task cards.
 * 
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtask array.
 */
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

/**
 * Creates or updates the progress bar for a task based on its subtasks' completion status.
 * If the progress bar elements do not exist, they are created and added to the task's subtask container.
 * 
 * @param {string} taskId - The ID of the task for which the progress bar is being updated or created.
 */
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

/**
 * Updates the progress bar for a task by calculating the percentage of completed subtasks 
 * and updating the visual width of the progress bar and the text label.
 * 
 * @param {string} taskId - The ID of the task whose progress bar is being updated.
 */
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