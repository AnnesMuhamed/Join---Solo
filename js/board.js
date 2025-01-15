"use strict";

const PATH_TO_CONTACTS = "contacts";
const PATH_TO_TASKS = "tasks";

let currentDraggedElement;

/**
 * Initializes the board by loading contacts, tasks, and rendering task cards.
 * @async
 */
async function initBoard() {
  await sessionStoreContacts(); // Loads and stores contacts in session storage.
  await sessionStoreTasks();    // Loads and stores tasks in session storage.
  renderCards();                // Renders task cards on the board.
}

/**
 * Dynamically includes HTML content into elements with the `w3-include-html` attribute.
 * @async
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text(); // Injects fetched HTML content.
    } else {
      element.innerHTML = "Page not found";  // Displays an error message if the fetch fails.
    }
  }
}

/**
 * Loads contact data from the server and stores it in the session storage.
 * @async
 */
async function sessionStoreContacts() {
  let contactsJson = await loadData(PATH_TO_CONTACTS);
  sessionStorage.setItem("contacts", JSON.stringify(contactsJson));
}

/**
 * Loads task data from the server and stores it in the session storage.
 * @async
 */
async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

/**
 * Generates the initials from a contact's first and last name.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @returns {string} The initials of the contact.
 */
function getAssignedContactInitials(firstName, lastName) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

/**
 * Removes a broken or invalid contact from a task's assignment list.
 * Updates the session storage and persists the change to the server.
 * 
 * @param {string} key - The key of the task in the tasks object.
 * @param {string} brokenId - The ID of the broken or invalid contact.
 */
function removeBrokenContact(key, brokenId) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks[key];
  let contacts = task.assignment.split(",");

  if (contacts.includes(brokenId)) {
    let brokenIndex = contacts.indexOf(brokenId);
    contacts.splice(brokenIndex, 1);
    task.assignment = contacts.join(",");
    tasks[key] = task;
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    updateData(PATH_TO_TASKS, tasks);
  }
}

/**
 * Retrieves valid contact details for a given task and handles any broken or invalid contacts.
 * 
 * @param {string} key - The key of the task in the tasks object.
 * @param {string} assignedContactsIds - A comma-separated string of assigned contact IDs.
 * @returns {Array} An array of objects containing the initials and color of valid contacts.
 */
function getContact(key, assignedContactsIds) {
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  let assignedContacts = assignedContactsIds.split(",");
  let brokenContacts = [];
  let resultContacts = [];

  for (let n = 0; n < assignedContacts.length; n++) {
    let currentContact = contacts[`${assignedContacts[n]}`];
    if (!currentContact) {
      brokenContacts.push(assignedContacts[n]);
      removeBrokenContact(key, assignedContacts[n]);
    } else {
      resultContacts.push({
        initials: getAssignedContactInitials(currentContact["firstName"], currentContact["lastName"]),
        color: currentContact.color || "#000000"
      });
    }
  }
  return resultContacts;
}

/**
 * Formats a date string into the German date format (DD.MM.YYYY).
 * 
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string in the German locale.
 */
function formatDate(dateString) {
  let dateStr = `${dateString}`;
  let date = new Date(dateStr);
  let options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("de-DE", options);
}

/**
 * Sets the ID of the currently dragged element and applies a visual "tilted" effect.
 * 
 * @param {DragEvent} event - The dragstart event triggered by dragging an element.
 */
function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add("tilted");
}

/**
 * Removes the "tilted" effect from the currently dragged element after dragging ends.
 */
function endDragging() {
  if (currentDraggedElement) {
    document.getElementById(currentDraggedElement).classList.remove("tilted"); 
  }
}

/**
 * Allows an element to be a valid drop target by preventing the default behavior.
 * 
 * @param {DragEvent} event - The dragover event triggered when an element is dragged over a drop target.
 */
function allowDrop(event) {
  event.preventDefault();
  event.target.classList.add('over'); // Umriss aktivieren
}

/**
 * Moves a task to a new state and updates the UI and backend data.
 * 
 * @param {DragEvent} event - The drag event triggered when a task is dropped on a new state container.
 * @param {string} state - The new state to assign to the dragged task (e.g., "in-progress", "done").
 */
function moveTo(event, state) {
  event.preventDefault();
  event.target.classList.remove('over');

  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let element = tasks[`${currentDraggedElement}`];

  if (element) {
    element.state = state;
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    updateData(PATH_TO_TASKS, tasks);
  }

  renderCards();
}

function updateEmptyColumns() {
  const columns = ['open', 'in-progress', 'await-feedback', 'done']; // Deine Kategorien
  columns.forEach((columnId) => {
      const column = document.getElementById(columnId);
      const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
      const tasksInColumn = Object.values(tasks).filter(task => task.state === columnId);
      
      if (tasksInColumn.length === 0) {
          column.innerHTML = '<p>No Tasks To-Do</p>';
      } else {
          column.innerHTML = ''; // Entferne den Platzhalter, wenn Aufgaben vorhanden sind
          tasksInColumn.forEach((task) => {
              // Funktion um Task-Karten zu erstellen
              createCard(task);
          });
      }
  });
}

/**
 * Creates a card container element for a task and appends it to the provided container.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {HTMLElement} taskCardsContainer - The container element where the task card should be appended.
 */
function createCardContainer(key, taskCardsContainer) {
  let cardDiv = document.createElement("div");
  cardDiv.id = `${key}`;
  cardDiv.className = "todo-card";
  cardDiv.draggable = "true";
  cardDiv.ondragstart = startDragging;
  cardDiv.ondragend = endDragging;
  cardDiv.onclick = () => openPopup(key);
  taskCardsContainer.appendChild(cardDiv);
}

/**
 * Creates an under-container element within a task card.
 * 
 * @param {string} key - The unique identifier for the task.
 */
function createUnderContainer(key) {
  let cardDiv = document.getElementById(`${key}`);
  let underDiv = document.createElement("div");
  underDiv.id = `${key}-under-container`;
  underDiv.className = "under-container";
  cardDiv.appendChild(underDiv);
}

/**
 * Creates a category tag element within a task card under-container.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {object} task - The task object containing category information.
 */
function createCategoryTag(key, task) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let tagContainer = document.createElement("div");
  tagContainer.id = `${key}-tag-container`;

  if (task["category"] === "Technical Task") {
    tagContainer.className = "technical-cards-headline-container";
  } else if (task["category"] === "User Story") {
    tagContainer.className = "user-cards-headline-container";
  }

  underDiv.appendChild(tagContainer);
}

/**
 * Creates a span element for the task category and appends it to the category tag container.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {object} task - The task object containing category information.
 */
function createTagSpan(key, task) {
  let tagContainer = document.getElementById(`${key}-tag-container`);
  let tagSpan = document.createElement("span");
  tagSpan.id = `${key}-span`;
  tagSpan.className = "cards-headline";
  tagSpan.textContent = `${task["category"]}`;
  tagContainer.appendChild(tagSpan);
}

/**
 * Creates an `h1` element for the task title and appends it to the task's under-container.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {object} task - The task object containing title information.
 */
function createTitle(key, task) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let titleTag = document.createElement("h1");
  titleTag.id = `${key}-title`;
  titleTag.className = "cards-title";
  titleTag.textContent = `${task["title"]}`;
  underDiv.appendChild(titleTag);
}

/**
 * Creates a `span` element for the task description and appends it to the task's under-container.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {object} task - The task object containing description information.
 */
function createDescription(key, task) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let descriptionTag = document.createElement("span");
  descriptionTag.id = `${key}-description`;
  descriptionTag.className = "cards-description";
  descriptionTag.textContent = `${task["description"]}`;
  underDiv.appendChild(descriptionTag);
}

/**
 * Creates a container for subtasks and appends it to the task's under-container.
 * 
 * @param {string} key - The unique identifier for the task.
 */
function createSubtaskContainer(key) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let subtaskContainer = document.createElement("div");
  subtaskContainer.id = `${key}-subtask`;
  subtaskContainer.className = "card-subtask-container";
  underDiv.appendChild(subtaskContainer);
}

/**
 * Reduces a list of subtasks to calculate the total and completed subtasks.
 * 
 * @param {Array} subtasksList - Array of subtask objects, each with a status.
 * @returns {Object} An object containing the total subtasks and the number of closed (completed) subtasks.
 */
function reducerFunction(subtasksList) {
  let acc = { closed: 0, total: 0 };
  for (let subtask of subtasksList) {
    let key = Object.keys(subtask)[0];
    if (subtask[`${key}`] !== "open") {
      acc.closed += 1;
    }
    acc.total += 1;
  }
  return acc;
}

/**
 * Creates and appends a subtask counter element to a task card.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {Object} task - The task object containing subtasks information.
 */
function createSubtaskCounter(key, task) {
  let subtaskContainer = document.getElementById(`${key}-subtask`);
  let subtasksCounter = document.createElement("span");
  subtasksCounter.id = `${key}-subtask-counter`;
  let subtasksList = JSON.parse(task.subtasks);
  let counter = reducerFunction(subtasksList);
  subtasksCounter.textContent = `${counter.closed}/${counter.total} Subtasks`;
  subtaskContainer.appendChild(subtasksCounter);
}

/**
 * Creates and appends a progress container element to a subtask container.
 * 
 * @param {string} key - The unique identifier for the task.
 */
function createProgressContainer(key) {
  let subtaskContainer = document.getElementById(`${key}-subtask`);
  let progressContainer = document.createElement("div");
  progressContainer.id = `${key}-progress`;
  progressContainer.className = "progress-container";
  subtaskContainer.appendChild(progressContainer);
}

/**
 * Updates the width of a progress bar based on the completion state of subtasks.
 * 
 * @param {string} id - The ID of the progress bar element.
 * @param {Object} task - The task object containing subtasks data.
 */
function subtasksProgress(id, task) {
  let progressBar = document.getElementById(id);
  let subtasksList = JSON.parse(task.subtasks);
  let subtasksState = reducerFunction(subtasksList);
  let width = (subtasksState.closed / subtasksState.total) * 100;
  progressBar.style.width = `${width}%`;
}

/**
 * Creates a progress bar for a given task and appends it to the progress container.
 * The progress bar's width is set based on the number of completed subtasks out of the total subtasks.
 * 
 * @param {string} key - The unique key identifying the task.
 * @param {Object} task - The task object containing subtasks data.
 */
function createProgressBar(key, task) {
  let progressContainer = document.getElementById(`${key}-progress`);
  let progressBar = document.createElement("div");
  progressBar.id = `${key}-progress-bar`;
  progressBar.className = "progress-bar";
  progressContainer.appendChild(progressBar);
  let subtasks = JSON.parse(task.subtasks);
  let totalSubtasks = subtasks.length;
  let completedSubtasks = subtasks.filter(subtask => {
    let subtaskKey = Object.keys(subtask)[0];
    return subtask[subtaskKey] === "done";
  }).length;
  let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  let progressLabel = document.createElement("span");
  progressLabel.id = `${key}-subtask-counter`;
  progressLabel.className = "subtask-counter";
  progressLabel.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  progressContainer.appendChild(progressLabel);
}

/**
 * Creates a container for contacts and priority assignment, then appends it to the under-container.
 * 
 * @param {string} key - The unique key identifying the task or container.
 */
function createContactsAndPrioContainer(key) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let assignmentPrioContainer = document.createElement("div");
  assignmentPrioContainer.id = `${key}-contacts-prio`;
  assignmentPrioContainer.className = "contacts-prio";
  underDiv.appendChild(assignmentPrioContainer);
}

/**
 * Creates a container for assigned contacts and appends it to the contacts-prio container.
 * 
 * @param {string} key - The unique key identifying the task or container.
 */
function createAssignedContactsContainer(key) {
  let assignmentPrioContainer = document.getElementById(`${key}-contacts-prio`);
  let assignedContactsContainer = document.createElement("div");
  assignedContactsContainer.id = `${key}-assigned-contacts`;
  assignedContactsContainer.className = "assigned-contacts-container";
  assignmentPrioContainer.appendChild(assignedContactsContainer);
}

/**
 * Creates and appends spans for assigned contacts based on the task's assignment data.
 * Displays up to 4 assigned contacts, and if there are more, shows the count of extra contacts.
 * 
 * @param {string} key - The unique key identifying the task or container.
 * @param {Object} task - The task object containing assignment data.
 */
function createAssignedContacts(key, task) {
  let assignedContactsContainer = document.getElementById(`${key}-assigned-contacts`);

  // Check if the task has an assignment value.
  if (task["assignment"] !== "") {
    let assignedContacts = getContact(key, task["assignment"]);
    let contactCount = assignedContacts.length;

    // Loop through up to the first 4 contacts and create their span elements.
    assignedContacts.slice(0, 4).forEach((contact) => {
      let assignedContactsSpan = document.createElement("span");
      assignedContactsSpan.id = `${key}-${contact.initials}`;
      assignedContactsSpan.className = "initials-span";
      assignedContactsSpan.style.backgroundColor = contact.color;
      assignedContactsSpan.textContent = `${contact.initials}`;
      assignedContactsContainer.appendChild(assignedContactsSpan);
    });

    // If there are more than 4 contacts, display the count of extra contacts.
    if (contactCount > 4) {
      let extraContactsSpan = document.createElement("span");
      extraContactsSpan.className = "extra-contacts-span";
      extraContactsSpan.textContent = `+${contactCount - 4}`;
      assignedContactsContainer.appendChild(extraContactsSpan);
    }
  }
}

/**
 * Creates a container for priority assignment and appends it to the contacts-prio container.
 * 
 * @param {string} key - The unique key identifying the task or container.
 */
function createPrioContainer(key) {
  let assignmentPrioContainer = document.getElementById(`${key}-contacts-prio`);
  let prioContainer = document.createElement("div");
  prioContainer.id = `${key}-prio-container`;
  prioContainer.className = `prio-container`;
  assignmentPrioContainer.appendChild(prioContainer);
}

/**
 * Creates and appends a priority image to the priority container based on the task's priority.
 * The image corresponds to one of three priority levels (low, medium, high).
 * 
 * @param {string} key - The unique key identifying the task or container.
 * @param {Object} task - The task object containing priority data.
 */
function createPrio(key, task) {
  let prioContainer = document.getElementById(`${key}-prio-container`);
  prioContainer.innerHTML = "";  // Clear any existing content in the priority container.

  // Create an image element for the priority.
  let prioImage = document.createElement("img");
  prioImage.id = `${key}-prio`;

  // Check if the task has a defined priority and set the appropriate image.
  if (task.priority != null) {
    const images = {
      1: "./assets/img/prio-low.png",
      2: "./assets/img/Prio media.png",
      3: "./assets/img/prio-high.png",
    };
    prioImage.src = images[task.priority];
    prioImage.alt = `Priority ${task.priority}`;
  }

  // Append the priority image to the container.
  prioContainer.appendChild(prioImage);
}

/**
 * Creates a task card with various containers and elements (e.g., title, description, subtasks, contacts, priority).
 * It calls multiple helper functions to create and append the components of the task card.
 * 
 * @param {string} key - The unique key identifying the task or card.
 * @param {HTMLElement} taskCardsContainer - The container element where the task card will be appended.
 * @param {Object} task - The task object containing relevant data (e.g., subtasks, title, description, priority).
 */
function createCard(key, taskCardsContainer, task) {
  // Create the main container for the card and append it to the task cards container.
  createCardContainer(key, taskCardsContainer);

  // Create the under-container and append it to the task card.
  createUnderContainer(key);

  // Create and append category and tag components based on task data.
  createCategoryTag(key, task);
  createTagSpan(key, task);

  // Create and append the task title and description.
  createTitle(key, task);
  createDescription(key, task);

  // Create the subtask container and related components if subtasks exist.
  createSubtaskContainer(key);
  if (JSON.parse(task.subtasks).length > 0) {
    createProgressContainer(key);
    createProgressBar(key, task);
    createSubtaskCounter(key, task);
  }

  // Create and append containers for contacts and priority components.
  createContactsAndPrioContainer(key);
  createAssignedContactsContainer(key);
  createAssignedContacts(key, task);
  createPrioContainer(key);
  createPrio(key, task);
}

/**
 * Renders the task cards from the session storage and appends them to the appropriate columns.
 * If no tasks exist in a column, a placeholder message is shown. 
 * 
 * @throws {Error} Logs errors if task containers or columns are not found.
 */
function renderCards() {
  // Get the tasks from session storage.
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));

  // Get all task cards containers (columns).
  let allTaskCardsContainer = document.querySelectorAll(".drag-area");

  // Check if any task containers exist.
  if (!allTaskCardsContainer || allTaskCardsContainer.length === 0) {
      console.error("Es wurden keine Container mit der Klasse 'drag-area' gefunden.");
      return;
  }

  // Clear the contents of all task containers.
  allTaskCardsContainer.forEach((column) => {
      if (!column) {
          console.error("Ein Container ist null. Überprüfe, ob die IDs oder Klassen korrekt gesetzt wurden.");
      } else {
          column.innerHTML = "";
      }
  });

  // Define messages for empty columns.
  let columns = {
      "open": "No tasks To do",
      "in-progress": "No tasks In Progress",
      "closed": "No tasks Await Feedback",
      "done": "No tasks Done"
  };

  // Loop through the tasks and create a card for each task, appending it to the appropriate column.
  Object.keys(tasks).forEach((key) => {
      let task = tasks[key];
      let stateColumn = document.getElementById(task.state);
      if (stateColumn) {
          createCard(key, stateColumn, task);
      } else {
          console.error(`Container für Zustand ${task.state} nicht gefunden.`);
      }
  });

  // Check for empty columns and display a placeholder message if necessary.
  Object.keys(columns).forEach((columnId) => {
      let column = document.getElementById(columnId);
      if (column && column.children.length === 0) {
          let emptyContainer = document.createElement("div");
          emptyContainer.classList.add("empty-task-container");
          emptyContainer.textContent = columns[columnId];
          column.appendChild(emptyContainer);
      }
  });
}

/**
 * Handles the task element's movement to a new state when it is dragged and dropped.
 * Updates the task's state in session storage and calls the function to update the task data.
 * 
 * @param {Event} event - The event triggered by the drag-and-drop action.
 * @param {string} state - The new state to which the task is being moved (e.g., "open", "in-progress", etc.).
 */
function moveTo(event, state) {
  event.preventDefault();
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let element = tasks[`${currentDraggedElement}`];

  if (element) {
    element.state = state;
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    updateData(PATH_TO_TASKS, tasks);
  }

  renderCards();
}

/**
 * Searches for task cards based on the input query and displays matching tasks.
 * If the search query is less than 3 characters, all task cards are re-rendered.
 * 
 * @throws {Error} If no task containers are found, it clears the columns before rendering matched tasks.
 */
function searchCards() {
  let searchQuery = document.getElementById("Findcards").value.toLowerCase(); // ID sollte 'Findcards' sein
  if (searchQuery.length < 3) {
    renderCards();
    return;
  }

  let tasks = JSON.parse(sessionStorage.getItem("tasks"));

  let allTaskCardsContainer = document.querySelectorAll(".drag-area");
  allTaskCardsContainer.forEach((column) => (column.innerHTML = ""));

  Object.keys(tasks).forEach((key) => {
    let task = tasks[key];
    let taskTitle = task["title"].toLowerCase();
    if (taskTitle.includes(searchQuery)) {
      let taskCardsContainer = document.getElementById(task["state"]);
      createCard(key, taskCardsContainer, task);
    }
  });
}

/**
 * Checks the screen size and redirects to the task creation page if the screen width is small 
 * and the popup for adding a new task is visible.
 * 
 * @throws {Error} If the popup is visible on a small screen, the task form will be closed and the user will be redirected.
 */
function checkScreenSizeAndRedirect() {
  const popup = document.getElementById("board-newTask");
  const screenWidth = window.innerWidth;
  if (screenWidth <= 920 && popup && popup.classList.contains("show")) {
      closeBoardAddTaskForm();
      window.location.href = "../add-task.html";
  }
}

/**
 * Handles the window resize event and checks if the task popup is visible.
 * If the popup is visible, it checks the screen size and redirects if necessary.
 */
function handleResize() {
  const popup = document.getElementById("board-newTask");
  if (popup && popup.classList.contains("show")) {
      checkScreenSizeAndRedirect();
  }
}

/**
 * Sets up the window resize event handler to check screen size and redirect if necessary.
 */
window.onresize = handleResize;

/**
 * Opens the task creation form and checks screen size for potential redirection.
 */
function openBoardAddTaskForm() {
  openForm("board-newTask");
  checkScreenSizeAndRedirect();
}

/**
 * Closes the task creation form.
 */
function closeBoardAddTaskForm() {
  closeForm("board-newTask");
}

/**
 * Opens a form by adding the "show" class, displaying an overlay, and adjusting the body styling.
 * 
 * @param {string} formId - The ID of the form to be opened.
 */
function openForm(formId) {
  document.getElementById(formId).classList.add("show");
  document.getElementById("overlay").style.display = "flex";
  document.body.classList.add("modal-open");
}

/**
 * Closes a form by removing the "show" class, hiding the overlay, and adjusting the body styling.
 * 
 * @param {string} formId - The ID of the form to be closed.
 */
function closeForm(formId) {
  document.getElementById(formId).classList.remove("show");
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("modal-open");
}
