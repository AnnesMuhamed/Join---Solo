let isEditing = false;

function openPopup(key) {
  const popupContainer = document.querySelector(".popup-container");
  const popup = document.getElementById("popup");
  const tagContainer = document.getElementById("tag-container");
  const tag = document.getElementById("tag");
  const popupTitle = document.getElementById("popup-title");
  const popupSubtitle = document.getElementById("popup-subtitle");
  const dueDateElement = document.getElementById("due-date");
  const priorityContainer = document.getElementById("priority-container");
  const priorityLabel = document.getElementById("priority-label");
  const priorityIcon = document.getElementById("priority-icon");
  const assigneeInitials = document.getElementById("assignee-initials");
  const assigneeName = document.getElementById("assignee-name");
  const subtasksList = document.getElementById("subtasks-list");

  const tasks = JSON.parse(sessionStorage.getItem("tasks"));
  const task = tasks[key];

  // Determine the task type and update the styles accordingly
  if (task.category === "Technical Task") {
    tagContainer.classList.add("technical-cards-headline-container");
    tag.textContent = "Technical Task";
  } else {
    tagContainer.classList.add("user-cards-headline-container");
    tag.textContent = "User Story";
  }

  popupTitle.textContent = task.title;
  popupSubtitle.textContent = task.description;
  dueDateElement.textContent = formatDate(task.dueDate);

  priorityLabel.textContent = getPriorityLabel(task.priority);
  priorityIcon.src = getPriorityIcon(task.priority);

  if (task.assignment) {
    const assignedContacts = getContact(task.assignment);
    assigneeInitials.textContent = assignedContacts[0];
    assigneeInitials.style.backgroundColor = getRandomColor();
    assigneeName.textContent = "Anton Adler"; // Assuming the contact name is always 'Anton Adler'
  }

  subtasksList.innerHTML = "";
  const subtasks = JSON.parse(task.subtasks);
  subtasks.forEach((subtask, index) => {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "subtask-checkbox";
    const subtaskLabel = document.createElement("span");
    subtaskLabel.className = "subtask-label";
    subtaskLabel.textContent = Object.keys(subtask)[0];
    subtaskItem.appendChild(checkbox);
    subtaskItem.appendChild(subtaskLabel);
    subtasksList.appendChild(subtaskItem);
  });
  // Store the task key as a data attribute on the popup
  popup.dataset.taskKey = key;

  popupContainer.classList.add("show");
}

function closePopup() {
  const popupContainer = document.querySelector(".popup-container");
  popupContainer.classList.remove("show");
  isEditing = false;
  resetEditButton();
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    default:
      return "Unknown";
  }
}
function editTask() {
  const popup = document.getElementById("popup");
  const taskKey = popup.dataset.taskKey;
  const tasks = JSON.parse(sessionStorage.getItem("tasks"));
  const task = tasks[taskKey];

  if (!isEditing) {
    // Switch to edit mode
    isEditing = true;
    makeFieldsEditable(task);
    changeEditButtonToSave();
  } else {
    // Save changes
    saveChanges(taskKey);
    isEditing = false;
    resetEditButton();
  }
}

function makeFieldsEditable(task) {
  const popupTitle = document.getElementById("popup-title");
  const popupSubtitle = document.getElementById("popup-subtitle");
  const dueDateElement = document.getElementById("due-date");
  const priorityContainer = document.getElementById("priority-container");

  // Make title editable
  popupTitle.contentEditable = true;
  popupTitle.classList.add("editable");

  // Make description editable
  popupSubtitle.contentEditable = true;
  popupSubtitle.classList.add("editable");

  // Make due date editable
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = task.dueDate;
  dateInput.classList.add("editable");
  dueDateElement.innerHTML = "";
  dueDateElement.appendChild(dateInput);

  // Make priority editable
  const prioritySelect = document.createElement("select");
  prioritySelect.innerHTML = `
    <option value="1">Low</option>
    <option value="2">Medium</option>
    <option value="3">High</option>
  `;
  prioritySelect.value = task.priority;
  prioritySelect.classList.add("editable");
  priorityContainer.innerHTML = "";
  priorityContainer.appendChild(prioritySelect);

  // Make subtasks editable
  const subtasksList = document.getElementById("subtasks-list");
  const subtasks = JSON.parse(task.subtasks);
  subtasksList.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    const subtaskInput = document.createElement("input");
    subtaskInput.type = "text";
    subtaskInput.value = Object.keys(subtask)[0];
    subtaskInput.className = "subtask-input editable";
    subtaskItem.appendChild(subtaskInput);
    subtasksList.appendChild(subtaskItem);
  });
}

function changeEditButtonToSave() {
  const editButton = document.querySelector(".action-button:nth-child(3)");
  // <img src="../img/save-icon.png" alt="Save" class="action-icon" />
  editButton.innerHTML = `
    <span class="action-label">Save</span>
  `;
}

function resetEditButton() {
  const editButton = document.querySelector(".action-button:nth-child(3)");
  editButton.innerHTML = `
    <img src="../img/edit-black.png" alt="Edit" class="action-icon" />
    <span class="action-label">Edit</span>
  `;
}

function saveChanges(taskKey) {
  const tasks = JSON.parse(sessionStorage.getItem("tasks"));
  const task = tasks[taskKey];

  task.title = document.getElementById("popup-title").textContent;
  task.description = document.getElementById("popup-subtitle").textContent;
  task.dueDate = document.querySelector("#due-date input").value;
  task.priority = document.querySelector("#priority-container select").value;

  const subtasks = [];
  document.querySelectorAll(".subtask-input").forEach((input) => {
    subtasks.push({ [input.value]: "open" });
  });
  task.subtasks = JSON.stringify(subtasks);

  sessionStorage.setItem("tasks", JSON.stringify(tasks));
  updateData(PATH_TO_TASKS, tasks);
  renderCards();
  openPopup(taskKey); // Refresh the popup with new data
}

function getPriorityIcon(priority) {
  switch (priority) {
    case 1:
      return "../img/prio-low.png";
    case 2:
      return "../img/Prio media.png";
    case 3:
      return "../img/prio-high.png";
    default:
      return "";
  }
}
function deleteTask() {
  const popup = document.getElementById("popup");
  const taskKey = popup.dataset.taskKey;

  // Show a confirmation dialog
  if (confirm("Are you sure you want to delete this task?")) {
    // Retrieve tasks from sessionStorage
    let tasks = JSON.parse(sessionStorage.getItem("tasks"));

    // Delete the task
    delete tasks[taskKey];

    // Update sessionStorage
    sessionStorage.setItem("tasks", JSON.stringify(tasks));

    // Update the backend
    updateData(PATH_TO_TASKS, tasks);

    // Close the popup
    closePopup();

    // Re-render the board
    renderCards();
  }
}
