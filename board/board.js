"use strict";

const PATH_TO_CONTACTS = "contacts";
const PATH_TO_TASKS = "tasks";

let currentDraggedElement;

async function initBoard() {
  await sessionStoreContacts();
  await sessionStoreTasks();
  renderCards();

  document.getElementById("findCards").addEventListener("input", searchCards);
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

async function sessionStoreContacts() {
  let contactsJson = await loadData(PATH_TO_CONTACTS);
  sessionStorage.setItem("contacts", JSON.stringify(contactsJson));
}

async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

function getAssignedContactInitials(firstName, lastName) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

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

function formatDate(dateString) {
  let dateStr = `${dateString}`;
  let date = new Date(dateStr);
  let options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("de-DE", options);
}

function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add("tilted");
}

function endDragging() {
  if (currentDraggedElement) {
    document.getElementById(currentDraggedElement).classList.remove("tilted"); 
  }
}

function allowDrop(event) {
  event.preventDefault();
}

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

function createUnderContainer(key) {
  let cardDiv = document.getElementById(`${key}`);
  let underDiv = document.createElement("div");
  underDiv.id = `${key}-under-container`;
  underDiv.className = "under-container";
  cardDiv.appendChild(underDiv);
}

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

function createTagSpan(key, task) {
  let tagContainer = document.getElementById(`${key}-tag-container`);
  let tagSpan = document.createElement("span");
  tagSpan.id = `${key}-span`;
  tagSpan.className = "cards-headline";
  tagSpan.textContent = `${task["category"]}`;
  tagContainer.appendChild(tagSpan);
}

function createTitle(key, task) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let titleTag = document.createElement("h1");
  titleTag.id = `${key}-title`;
  titleTag.className = "cards-title";
  titleTag.textContent = `${task["title"]}`;
  underDiv.appendChild(titleTag);
}

function createDescription(key, task) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let descriptionTag = document.createElement("span");
  descriptionTag.id = `${key}-description`;
  descriptionTag.className = "cards-description";
  descriptionTag.textContent = `${task["description"]}`;
  underDiv.appendChild(descriptionTag);
}

function createSubtaskContainer(key) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let subtaskContainer = document.createElement("div");
  subtaskContainer.id = `${key}-subtask`;
  subtaskContainer.className = "card-subtask-container";
  underDiv.appendChild(subtaskContainer);
}

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

function createSubtaskCounter(key, task) {
  let subtaskContainer = document.getElementById(`${key}-subtask`);
  let subtasksCounter = document.createElement("span");
  subtasksCounter.id = `${key}-subtask-counter`;
  let subtasksList = JSON.parse(task.subtasks);
  let counter = reducerFunction(subtasksList);
  subtasksCounter.textContent = `${counter.closed}/${counter.total} Subtasks`;
  subtaskContainer.appendChild(subtasksCounter);
}


function createProgressContainer(key) {
  let subtaskContainer = document.getElementById(`${key}-subtask`);
  let progressContainer = document.createElement("div");
  progressContainer.id = `${key}-progress`;
  progressContainer.className = "progress-container";
  subtaskContainer.appendChild(progressContainer);
}

function subtasksProgress(id, task) {
  let progressBar = document.getElementById(id);
  let subtasksList = JSON.parse(task.subtasks);
  let subtasksState = reducerFunction(subtasksList);
  let width = (subtasksState.closed / subtasksState.total) * 100;
  progressBar.style.width = `${width}%`;
}

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

function createContactsAndPrioContainer(key) {
  let underDiv = document.getElementById(`${key}-under-container`);
  let assignmentPrioContainer = document.createElement("div");
  assignmentPrioContainer.id = `${key}-contacts-prio`;
  assignmentPrioContainer.className = "contacts-prio";
  underDiv.appendChild(assignmentPrioContainer);
}

function createAssignedContactsContainer(key) {
  let assignmentPrioContainer = document.getElementById(`${key}-contacts-prio`);
  let assignedContactsContainer = document.createElement("div");
  assignedContactsContainer.id = `${key}-assigned-contacts`;
  assignedContactsContainer.className = "assigned-contacts-container";
  assignmentPrioContainer.appendChild(assignedContactsContainer);
}

function createAssignedContacts(key, task) {
  let assignedContactsContainer = document.getElementById(`${key}-assigned-contacts`);

  if (task["assignment"] !== "") {
    let assignedContacts = getContact(key, task["assignment"]);
    let contactCount = assignedContacts.length;

    assignedContacts.slice(0, 4).forEach((contact) => {
      let assignedContactsSpan = document.createElement("span");
      assignedContactsSpan.id = `${key}-${contact.initials}`;
      assignedContactsSpan.className = "initials-span";
      assignedContactsSpan.style.backgroundColor = contact.color;
      assignedContactsSpan.textContent = `${contact.initials}`;
      assignedContactsContainer.appendChild(assignedContactsSpan);
    });

    if (contactCount > 4) {
      let extraContactsSpan = document.createElement("span");
      extraContactsSpan.className = "extra-contacts-span";
      extraContactsSpan.textContent = `+${contactCount - 4}`;
      assignedContactsContainer.appendChild(extraContactsSpan);
    }
  }
}

function createPrioContainer(key) {
  let assignmentPrioContainer = document.getElementById(`${key}-contacts-prio`);
  let prioContainer = document.createElement("div");
  prioContainer.id = `${key}-prio-container`;
  prioContainer.className = `prio-container`;
  assignmentPrioContainer.appendChild(prioContainer);
}

function createPrio(key, task) {
  let prioContainer = document.getElementById(`${key}-prio-container`);
  prioContainer.innerHTML = "";
  let prioImage = document.createElement("img");
  prioImage.id = `${key}-prio`;

  if (task.priority != null) {
    const images = {
      1: "../img/prio-low.png",
      2: "../img/Prio media.png",
      3: "../img/prio-high.png",
    };
    prioImage.src = images[task.priority];
    prioImage.alt = `Priority ${task.priority}`;
  }
  prioContainer.appendChild(prioImage);
}

function createCard(key, taskCardsContainer, task) {
  createCardContainer(key, taskCardsContainer);
  createUnderContainer(key);
  createCategoryTag(key, task);
  createTagSpan(key, task);
  createTitle(key, task);
  createDescription(key, task);
  createSubtaskContainer(key);
  if (JSON.parse(task.subtasks).length > 0) {
    createProgressContainer(key);
    createProgressBar(key, task);
    createSubtaskCounter(key, task);
  }
  createContactsAndPrioContainer(key);
  createAssignedContactsContainer(key);
  createAssignedContacts(key, task);
  createPrioContainer(key);
  createPrio(key, task);
}

function renderCards() {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let allTaskCardsContainer = document.querySelectorAll(".drag-area");
  if (!allTaskCardsContainer || allTaskCardsContainer.length === 0) {
      console.error("Es wurden keine Container mit der Klasse 'drag-area' gefunden.");
      return;
  }
  allTaskCardsContainer.forEach((column) => {
      if (!column) {
          console.error("Ein Container ist null. Überprüfe, ob die IDs oder Klassen korrekt gesetzt wurden.");
      } else {
          column.innerHTML = "";
      }
  });
  let columns = {
      "open": "No tasks To do",
      "in-progress": "No tasks In Progress",
      "closed": "No tasks Await Feedback",
      "done": "No tasks Done"
  };
  Object.keys(tasks).forEach((key) => {
      let task = tasks[key];
      let stateColumn = document.getElementById(task.state);
      if (stateColumn) {
          createCard(key, stateColumn, task);
      } else {
          console.error(`Container für Zustand ${task.state} nicht gefunden.`);
      }
  });
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

function searchCards() {
  let searchQuery = document.getElementById("findCards").value.toLowerCase();

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

function checkScreenSizeAndRedirect() {
  const popup = document.getElementById("board-newTask");
  const screenWidth = window.innerWidth;
  if (screenWidth <= 920 && popup && popup.classList.contains("show")) {
      closeBoardAddTaskForm();
      window.location.href = "../add-task/add-task.html";
  }
}

function handleResize() {
  const popup = document.getElementById("board-newTask");
  if (popup && popup.classList.contains("show")) {
      checkScreenSizeAndRedirect();
  }
}

window.onresize = handleResize;

function openBoardAddTaskForm() {
  openForm("board-newTask");
  checkScreenSizeAndRedirect();
}

function closeBoardAddTaskForm() {
  closeForm("board-newTask");
}

function openForm(formId) {
  document.getElementById(formId).classList.add("show");
  document.getElementById("overlay").style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeForm(formId) {
  document.getElementById(formId).classList.remove("show");
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("modal-open");
}

function openForm(id) {
  document.getElementById(id).classList.add('show');
  document.getElementById("overlay").style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeForm(id) {
  document.getElementById(id).classList.remove('show');
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("modal-open");
}



