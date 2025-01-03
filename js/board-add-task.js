"use strict";

let boardPathTasks = "tasks";
let boardSubtasks = [];
let boardAssignedContacts = [];
let boardPriority = null;
let boardExpanded = false; 

async function initBoardAddTask() {
    await loadBoardContacts();
    renderBoardCheckboxes();
}
  
async function boardCreateTask(event) {
    event.preventDefault();
    const title = document.getElementById("board-title").value.trim();
    const description = document.getElementById("board-description").value.trim();
    const date = document.getElementById("board-date").value;
    const category = document.getElementById("board-category").value;
    
    if (!title || !date || !category) {
        alert('Bitte füllen Sie alle erforderlichen Felder (Titel, Fälligkeitsdatum, Kategorie) aus.');
        return;
    }
    const newTask = {
        title: title,
        description: description,
        assignment: boardAssignedContacts.join(","),
        date: date,
        priority: boardPriority,
        category: category,
        subtasks: JSON.stringify(boardSubtasks),
        state: "open"
    };

    try {
        await postData('tasks', newTask);
        alert("Aufgabe erfolgreich erstellt und in Firebase gespeichert.");
        renderCards();
        closeBoardAddTaskForm();
        window.open("../board/board.html");
    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe in Firebase:", error);
    }
}

function boardCreateTaskJson() {
    let task = {
      title: document.getElementById("board-title").value.trim(),
      description: document.getElementById("board-description").value.trim() || "",
      assignment: boardAssignedContacts.join(","),
      date: document.getElementById("board-date").value,
      priority: boardPriority,
      category: document.getElementById("board-category").value,
      subtasks: JSON.stringify(boardSubtasks),
      state: "open",
    };
    return task;
}

async function loadBoardContacts() {
    let contacts = JSON.parse(sessionStorage.getItem("contacts"));
    if (contacts) {
      renderBoardCheckboxes();
    } else {
      console.error("Kontakte konnten nicht geladen werden.");
    }
}

function renderBoardCheckboxes() {
    const contacts = JSON.parse(sessionStorage.getItem("contacts"));

    if (!contacts) {
        console.error("Kontakte konnten nicht aus dem Session Storage geladen werden.");
        return;
    }

    const checkboxes = document.getElementById("board-checkboxes");
    checkboxes.innerHTML = "";

    for (let id in contacts) {
        const contact = contacts[id];
        const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
        const fullName = `${contact.firstName} ${contact.lastName}`;
        const contactColor = contact.color || "#000000";

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "checkbox-label";
        checkboxLabel.htmlFor = id;

        const spanInitials = document.createElement("span");
        spanInitials.className = "initials-span board-task";
        spanInitials.textContent = initials;
        spanInitials.style.backgroundColor = contactColor;

        const spanFullName = document.createElement("span");
        spanFullName.className = "contact-name";
        spanFullName.textContent = fullName;

        const checkbox = document.createElement("div");
        checkbox.className = "custom-checkbox";
        checkbox.id = `checkbox-${id}`;

        if (boardAssignedContacts.includes(id)) {
            checkbox.classList.add("checked");
            checkboxLabel.classList.add("checked");
        }

        checkbox.onclick = (event) => boardAssignContacts(event, id);

        checkboxLabel.appendChild(spanInitials);
        checkboxLabel.appendChild(spanFullName);
        checkboxLabel.appendChild(checkbox);
        checkboxes.appendChild(checkboxLabel);
    }
}


function boardToggleCheckboxes() {
    const checkboxes = document.getElementById("board-checkboxes");
    
    if (!checkboxes) {
      console.error("Checkboxes-Element nicht gefunden.");
      return;
    }

    if (boardExpanded) {
      checkboxes.classList.add('d-none');
    } else {
      checkboxes.classList.remove('d-none');
      renderBoardCheckboxes();
    }
    boardExpanded = !boardExpanded;
}

function boardAssignContacts(event, id) {
    const checkbox = event.target;
    const label = checkbox.parentElement;
    const assignmentsContainer = document.getElementById("board-assigned-contacts");
    const contacts = JSON.parse(sessionStorage.getItem("contacts"));
    const initials = `${contacts[id].firstName.charAt(0)}${contacts[id].lastName.charAt(0)}`;
    const contactColor = contacts[id].color || "#000000"; 

    if (!Array.isArray(boardAssignedContacts)) {
        boardAssignedContacts = [];
    }

    if (checkbox.classList.contains("checked")) {
        checkbox.classList.remove("checked");
        label.classList.remove("checked");
        document.getElementById(`assigned-${id}`).remove();
        removeBoardContact(id);
    } else {
        checkbox.classList.add("checked");
        label.classList.add("checked");

        if (!boardAssignedContacts.includes(id)) {
            boardAssignedContacts.push(id);

            const newSpan = document.createElement("span");
            newSpan.className = "initials-span board-task";
            newSpan.id = `assigned-${id}`;
            newSpan.textContent = initials;
            newSpan.style.backgroundColor = contactColor;
            assignmentsContainer.appendChild(newSpan);
        }
    }
}

function addBoardContacts(contactId) {
    if (boardAssignedContacts.length > 0) {
      boardAssignedContacts += `,${contactId}`;
    } else {
      boardAssignedContacts = contactId;
    }
}

function removeBoardContact(contactId) {
    const index = boardAssignedContacts.indexOf(contactId);
    if (index !== -1) {
        boardAssignedContacts.splice(index, 1);
    }
}

function boardConfirmOrCancelSubtask() {
  const subtaskButtonContainer = document.getElementById('board-subtask-buttons-container');
  const subtask = document.getElementById('board-subtasks').value.trim();

  if (subtask) {
    subtaskButtonContainer.innerHTML = generateBoardSubtaskButtonsTemplate();
  }
}

function boardRenderSubtask() {
  let unsortedList = document.getElementById("board-subtask-list");
  let subtask = document.getElementById("board-subtasks").value.trim();

  if (subtask) {
    boardSubtasks.push({ [subtask]: "open" });
    let newListElement = document.createElement("li");
    newListElement.classList.add("subtask-list-element");
    newListElement.innerHTML = generateBoardSubtaskTemplate(subtask);
    unsortedList.appendChild(newListElement);
    boardClearSubtaskInput();
  }
}

function boardClearSubtaskInput() {
  const subtaskButtonContainer = document.getElementById("board-subtask-buttons-container");
  const subtask = document.getElementById("board-subtasks");
  subtask.value = "";
  subtaskButtonContainer.innerHTML = generateBoardClearSubtaskTemplate();
}

function getBoardTitle() {
    let title = document.getElementById("board-title");
    return title.value;
}
  
function getBoardDescription() {
    let description = document.getElementById("board-description");
    return description.value;
} 

function toggleBoardCheckboxes() {
    let checkboxes = document.getElementById("board-checkboxes");
    if (!checkboxes) {
      console.error("Checkboxes-Element nicht gefunden.");
      return;
    }
  
    if (checkboxes.style.display === "block") {
      checkboxes.style.display = "none";
    } else {
      checkboxes.style.display = "block";
    }
}  

function assignBoardContacts(event) {
    console.log("Board assignContacts aufgerufen für:", event.target.id);
    let assignments = document.getElementById("board-assigned-contacts");
    let checkboxId = event.target.id.replace("board-", "");
    let initials = `${contacts[checkboxId].firstName.charAt(0)}${contacts[checkboxId].lastName.charAt(0)}`;
    let initialsElement = document.getElementById(`board-${checkboxId}-${initials}`);
  
    if (event.target.checked) {
      if (!initialsElement) {
        let newSpan = document.createElement("span");
        newSpan.className = "initials-span board-task";
        newSpan.id = `board-${checkboxId}-${initials}`;
        newSpan.textContent = initials;
        assignments.appendChild(newSpan);
        addBoardContacts(checkboxId);
      }
    } else {
      if (initialsElement) {
        initialsElement.remove();
        removeBoardContacts(checkboxId);
      }
    }
}

function removeBoardContacts(contactId) {
    if (!Array.isArray(boardAssignedContacts)) {
        boardAssignedContacts = [];
    }

    const index = boardAssignedContacts.indexOf(contactId);
    if (index !== -1) {
        boardAssignedContacts.splice(index, 1);
    }
}

function boardClearForm() {
    document.getElementById("board-add-task-form").reset();
    boardPriority = null;
    boardSubtasks = [];
    boardAssignedContacts = [];
    document.getElementById("board-assigned-contacts").innerHTML = "";
    document.getElementById("board-subtask-list").innerHTML = "";
}

function boardEditSubtask(button) {
  const li = button.closest("li");
  const span = li.querySelector("span");
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.classList.add("edit-subtask-input");

  li.innerHTML = "";
  li.appendChild(input);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "edit-subtask-buttons-container";
  buttonsContainer.innerHTML = generateBoardEditSubtaskButtonsTemplate(span.textContent);
  li.appendChild(buttonsContainer);
}

function boardUpdateSubtask(button, oldSubtask) {
    const li = button.closest("li");
    const input = li.querySelector("input");
    const newSubtask = input.value.trim();
  
    if (newSubtask) {
      boardSubtasks = boardSubtasks.map(subtask =>
        subtask[oldSubtask] ? { [newSubtask]: subtask[oldSubtask] } : subtask
      );
  
      boardRenderSubtaskList();
    }
}

function boardRenderSubtaskList() {
  const listContainer = document.getElementById("board-subtask-list");
  listContainer.innerHTML = generateBoardSubtaskListTemplate(boardSubtasks);
}

function boardCancelEditSubtask(button, originalText) {
  const li = button.closest("li");
  li.innerHTML = generateBoardCancelEditSubtaskTemplate(originalText);
}

function boardSaveEditedSubtask(input, li) {
  const updatedText = input.value.trim();
  if (updatedText !== "") {
    li.innerHTML = generateBoardSaveSubtaskTemplate(updatedText);
  } else {
    li.remove();
  }
}

function boardDeleteSubtask(button) {
    const li = button.closest("li");
    const subtaskName = li.querySelector("span").textContent;
    boardSubtasks = boardSubtasks.filter(subtask => !subtask.hasOwnProperty(subtaskName));
    li.remove();
}

function boardFilterCheckboxes() {
    const filterValue = document.getElementById("board-search").value.toLowerCase();
    const contacts = JSON.parse(sessionStorage.getItem("contacts"));
    const checkboxes = document.getElementById("board-checkboxes");
    checkboxes.innerHTML = "";

    for (let id in contacts) {
        const contact = contacts[id];
        const fullName = `${contact.firstName.toLowerCase()} ${contact.lastName.toLowerCase()}`;

        if (fullName.includes(filterValue)) {
            const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
            const fullNameDisplay = `${contact.firstName} ${contact.lastName}`;
            const contactColor = contact.color || "#000000";
            const checkboxLabel = document.createElement("label");
            checkboxLabel.className = "checkbox-label";
            checkboxLabel.htmlFor = id;
            const spanInitials = document.createElement("span");
            spanInitials.className = "initials-span board-task";
            spanInitials.textContent = initials;
            spanInitials.style.backgroundColor = contactColor;
            const spanFullName = document.createElement("span");
            spanFullName.className = "contact-name";
            spanFullName.textContent = fullNameDisplay;
            const checkbox = document.createElement("div");
            checkbox.className = "custom-checkbox";
            checkbox.id = `checkbox-${id}`;
            checkbox.onclick = (event) => boardAssignContacts(event, id);
            checkboxLabel.appendChild(spanInitials);
            checkboxLabel.appendChild(spanFullName);
            checkboxLabel.appendChild(checkbox);
            checkboxes.appendChild(checkboxLabel);
        }
    }
}

function boardSetPrio(level) {
    const labels = document.querySelectorAll('#board-radio-button-group .radio-label');

    labels.forEach(label => {
        label.classList.remove('urgent', 'medium', 'low');
        label.querySelector('img').style.filter = "invert(0%)";
    });

    if (level === 'high') {
        document.getElementById('board-prio-high').checked = true;
        document.querySelector('label[for="board-prio-high"]').classList.add('urgent');
        document.querySelector('label[for="board-prio-high"] img').style.filter = "invert(100%)";
        boardPriority = 3;
    } else if (level === 'medium') {
        document.getElementById('board-prio-med').checked = true;
        document.querySelector('label[for="board-prio-med"]').classList.add('medium');
        document.querySelector('label[for="board-prio-med"] img').style.filter = "invert(100%)";
        boardPriority = 2;
    } else if (level === 'low') {
        document.getElementById('board-prio-low').checked = true;
        document.querySelector('label[for="board-prio-low"]').classList.add('low');
        document.querySelector('label[for="board-prio-low"] img').style.filter = "invert(100%)";
        boardPriority = 1;
    }
}



