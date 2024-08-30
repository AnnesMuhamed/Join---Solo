let isEditing = false;

function getHtmlElements() {
  let popupContainer = document.querySelector(".popup-container");
  let popup = document.getElementById("popup");
  let tagContainer = document.getElementById("tag-container");
  let tag = document.getElementById("tag");
  let popupTitle = document.getElementById("popup-title");
  let popupSubtitle = document.getElementById("popup-subtitle");
  let dueDateElement = document.getElementById("due-date");
  let priorityContainer = document.getElementById("priority-container");
  let priorityLabel = document.getElementById("priority-label");
  let priorityIcon = document.getElementById("priority-icon");
  let assigneeContainer = document.getElementById("assignee-container");
  let subtasksList = document.getElementById("subtasks-list");
  return [
    popupContainer,
    popup,
    tagContainer,
    tag,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityContainer,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ];
}

function getTask(key) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[key];
  return task;
}

function determineTaskType(task, tagContainer, tag) {
  if (task.category === "Technical Task") {
    tagContainer.classList.remove("user-cards-headline-container");
    tagContainer.classList.add("technical-cards-headline-container");
    tag.textContent = "Technical Task";
  } else {
    tagContainer.classList.remove("technical-cards-headline-container");
    tagContainer.classList.add("user-cards-headline-container");
    tag.textContent = "User Story";
  }
}

function determinePopoupTitle(task, popupTitle) {
  popupTitle.textContent = task.title;
}

function determinePopoupSubtitle(task, popupSubtitle) {
  popupSubtitle.textContent = task.description;
}

function determineDate(task, dueDateElement) {
  dueDateElement.textContent = formatDate(task.date);
}

function determineTaskPriority(task, priorityLabel, priorityIcon) {
  if (task.priority) {
    priorityLabel.textContent = getPriorityLabel(task.priority);
    priorityLabel.classList.add("d-none");
    priorityIcon.classList.remove("d-none");
    priorityIcon.src = getPriorityIcon(task.priority);
  } else {
    priorityLabel.textContent = "";
    priorityIcon.classList.add("d-none");
  }
}

function createAssignedContactsFields(
  assigneeContainer,
  assignedContacts,
  contacts
) {
  for (let contactId of assignedContacts) {
    let currentContact = contacts[`${contactId}`];
    assigneeContainer.innerHTML += `
            <div class="assignee-initials" id="${contactId}-assignee-initials">${getAssignedContactInitials(
      currentContact["firstName"],
      currentContact["lastName"]
    )}</div>
            <span class="assignee-name" id="${contactId}-assignee-name">${
      currentContact.firstName
    } ${currentContact.lastName}</span>
      `;
    let assigneeInitials = document.getElementById(
      `${contactId}-assignee-initials`
    );
    assigneeInitials.style.backgroundColor = getRandomColor();
  }
}

function determineAssignedContacts(task, assigneeContainer) {
  if (task.assignment) {
    let contacts = JSON.parse(sessionStorage.getItem("contacts"));
    let assignedContactsIds = task.assignment;
    let assignedContacts = assignedContactsIds.split(",");
    assigneeContainer.innerHTML = "";
    createAssignedContactsFields(assigneeContainer, assignedContacts, contacts);
  } else {
    assigneeContainer.innerHTML = "";
  }
}

function determineSubtasks(task, subtasksList) {
  subtasksList.innerHTML = "";
  let subtasks = JSON.parse(task.subtasks);
  subtasks.forEach((subtask, index) => {
    let subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "subtask-checkbox";
    let subtaskLabel = document.createElement("span");
    subtaskLabel.className = "subtask-label";
    subtaskLabel.textContent = Object.keys(subtask)[0];
    subtaskItem.appendChild(checkbox);
    subtaskItem.appendChild(subtaskLabel);
    subtasksList.appendChild(subtaskItem);
  });
}

function openPopup(key) {
  let [
    popupContainer,
    popup,
    tagContainer,
    tag,
    popupTitle,
    popupSubtitle,
    dueDateElement,
    priorityContainer,
    priorityLabel,
    priorityIcon,
    assigneeContainer,
    subtasksList,
  ] = getHtmlElements();

  task = getTask(key);

  determineTaskType(task, tagContainer, tag);
  determinePopoupTitle(task, popupTitle);
  determinePopoupSubtitle(task, popupSubtitle);
  determineDate(task, dueDateElement);
  determineTaskPriority(task, priorityLabel, priorityIcon);
  determineAssignedContacts(task, assigneeContainer);
  determineSubtasks(task, subtasksList);

  // Store the task key as a data attribute on the popup
  popup.dataset.taskKey = key;

  popupContainer.classList.add("show");
}

function closePopup() {
  let popupContainer = document.querySelector(".popup-container");
  popupContainer.classList.remove("show");
  isEditing = false;
  resetEditButton();
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
      return "";
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

function editTask() {
  let popup = document.getElementById("popup");
  let taskKey = popup.dataset.taskKey;
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[taskKey];

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
  let popupTitle = document.getElementById("popup-title");
  let popupSubtitle = document.getElementById("popup-subtitle");
  let dueDateElement = document.getElementById("due-date");
  let priorityContainer = document.getElementById("priority-container");

  // Make title editable
  popupTitle.contentEditable = true;
  popupTitle.classList.add("editable");

  // Make description editable
  popupSubtitle.contentEditable = true;
  popupSubtitle.classList.add("editable");

  // Make due date editable
  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = task.date;
  dateInput.classList.add("editable");
  dueDateElement.innerHTML = "";
  dueDateElement.appendChild(dateInput);

  // Make priority editable
  let prioritySelect = document.createElement("select");
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
  let subtasksList = document.getElementById("subtasks-list");
  let subtasks = JSON.parse(task.subtasks);
  subtasksList.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    let subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    let subtaskInput = document.createElement("input");
    subtaskInput.type = "text";
    subtaskInput.value = Object.keys(subtask)[0];
    subtaskInput.className = "subtask-input editable";
    subtaskItem.appendChild(subtaskInput);
    subtasksList.appendChild(subtaskItem);
  });
}

function changeEditButtonToSave() {
  let editButton = document.querySelector(".action-button:nth-child(3)");
  editButton.style.color = '#FFFFFF';
  editButton.style.backgroundColor = '#2A3647';
  editButton.innerHTML = `
    <span class="action-label">Ok</span>
    <img src="../img/hook.png" alt="Save" class="action-icon" />
  `;
}

function resetEditButton() {
  let editButton = document.querySelector(".action-button:nth-child(3)");
  editButton.innerHTML = `
    <img src="../img/edit-black.png" alt="Edit" class="action-icon" />
    <span class="action-label">Edit</span>
  `;
}

function saveChanges(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[taskKey];

  task.title = document.getElementById("popup-title").textContent;
  task.description = document.getElementById("popup-subtitle").textContent;
  task.date = document.querySelector("#due-date input").value;
  task.priority = document.querySelector("#priority-container select").value;

  let subtasks = [];
  document.querySelectorAll(".subtask-input").forEach((input) => {
    subtasks.push({ [input.value]: "open" });
  });
  task.subtasks = JSON.stringify(subtasks);

  sessionStorage.setItem("tasks", JSON.stringify(tasks));
  updateData(PATH_TO_TASKS, tasks);
  renderCards();
  openPopup(taskKey); // Refresh the popup with new data
}

function deleteTask() {
  let popup = document.getElementById("popup");
  let taskKey = popup.dataset.taskKey;

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
