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

  popupContainer.classList.add("show");
}

function closePopup() {
  const popupContainer = document.querySelector(".popup-container");
  popupContainer.classList.remove("show");
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
