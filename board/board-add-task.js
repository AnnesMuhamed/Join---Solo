"use strict";

let boardPathTasks = "tasks";
let boardSubtasks = [];
let boardAssignedContacts = "";
let boardPriority = null;
let boardExpanded = false; 

async function initBoardAddTask() {
    await loadBoardContacts();
    renderBoardCheckboxes();
}
  
async function boardCreateTask(event) {
    event.preventDefault();
    let task = boardCreateTaskJson();
    let tasks = JSON.parse(sessionStorage.getItem(boardPathTasks)) || {};
    const newTaskId = `task-${Date.now()}`;
    tasks[newTaskId] = task;
    sessionStorage.setItem(boardPathTasks, JSON.stringify(tasks));
  
    try {
      await postData(boardPathTasks, tasks);
      renderCards();
      closeBoardAddTaskForm();
    } catch (error) {
      console.error("Fehler beim Speichern der Aufgabe in Firebase:", error);
    }
}

function boardCreateTaskJson() {
    let task = {
      title: document.getElementById("board-title").value.trim(),
      description: document.getElementById("board-description").value.trim() || "",
      assignment: boardAssignedContacts,
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
    console.log("Board Kontakte geladen:", contacts);
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
  
      const checkboxLabel = document.createElement("label");
      checkboxLabel.className = "checkbox-label";
      checkboxLabel.htmlFor = id;
  
      const spanInitials = document.createElement("span");
      spanInitials.className = "initials-span board-task";
      spanInitials.textContent = initials;
  
      const spanFullName = document.createElement("span");
      spanFullName.className = "contact-name";
      spanFullName.textContent = fullName;
  
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

function boardToggleCheckboxes() {
    const checkboxes = document.getElementById("board-checkboxes");
    
    if (!checkboxes) {
      console.error("Checkboxes-Element nicht gefunden.");
      return;
    }
  
    if (boardExpanded) {
      checkboxes.style.display = "none";
    } else {
      checkboxes.style.display = "block";
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
  
    if (checkbox.classList.contains("checked")) {
      checkbox.classList.remove("checked");
      label.classList.remove("checked");
      document.getElementById(`assigned-${id}`).remove();
      removeBoardContacts(id);
    } else {
      checkbox.classList.add("checked");
      label.classList.add("checked");
  
      const newSpan = document.createElement("span");
      newSpan.className = "initials-span board-task";
      newSpan.id = `assigned-${id}`;
      newSpan.textContent = initials;
      newSpan.style.backgroundColor = getRandomColor();
      assignmentsContainer.appendChild(newSpan);
  
      addBoardContacts(id);
    }
}

function addBoardContacts(contactId) {
    if (boardAssignedContacts.length > 0) {
      boardAssignedContacts += `,${contactId}`;
    } else {
      boardAssignedContacts = contactId;
    }
}

function removeBoardContacts(contactId) {
    let contactsArray = boardAssignedContacts.split(",");
    const index = contactsArray.indexOf(contactId);
    if (index !== -1) {
      contactsArray.splice(index, 1);
    }
    boardAssignedContacts = contactsArray.join(",");
}

function boardConfirmOrCancelSubtask() {
    let subtaskButtonContainer = document.getElementById('board-subtask-buttons-container');
    let subtask = document.getElementById('board-subtasks').value.trim();
    
    if (subtask) {
      subtaskButtonContainer.innerHTML = `
        <button class="in-line-btn" type="button" onclick="boardClearSubtaskInput()">
          <img src="../img/add-task/clear.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#D1D1D1")}
        <button class="in-line-btn" type="button" onclick="boardRenderSubtask()">
          <img src="../img/add-task/check.png"/>
        </button>
      `;
    }
} 

function boardRenderSubtask() {
    let unsortedList = document.getElementById("board-subtask-list");
    let subtask = document.getElementById("board-subtasks").value.trim();
  
    if (subtask) {
      boardSubtasks.push({ [subtask]: "open" });
      let newListElement = document.createElement("li");
      newListElement.classList.add("subtask-list-element");
      newListElement.innerHTML = `
        <span>${subtask}</span>
        <div class="subtaskli-buttons-container">
          <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
            <img src="../img/add-task/edit.png"/>
          </button>
          ${verticalSeparator("1px", "24px", "#A8A8A8")}
          <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
            <img src="../img/add-task/delete.png"/>
          </button>
        </div>
      `;
      unsortedList.appendChild(newListElement);
      boardClearSubtaskInput();
    }
}

function boardClearSubtaskInput() {
    let subtaskButtonContainer = document.getElementById("board-subtask-buttons-container");
    let subtask = document.getElementById("board-subtasks");
    subtask.value = "";
    subtaskButtonContainer.innerHTML = `
        <button id="board-add-subtask-button" class="in-line-btn" type="button" onclick="boardConfirmOrCancelSubtask()">
        <img src="../img/add-task/add.png" />
        </button>
    `;
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

function boardClearForm() {
    document.getElementById("board-add-task-form").reset();
    boardPriority = null;
    boardSubtasks = [];
    boardAssignedContacts = ""; 
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
    buttonsContainer.innerHTML = `
      <button class="in-line-btn" type="button" onclick="boardUpdateSubtask(this, '${span.textContent}')">
        <img src="../img/add-task/check.png"/>
      </button>
      ${verticalSeparator("1px", "24px", "#A8A8A8")}
      <button class="in-line-btn" type="button" onclick="boardCancelEditSubtask(this, '${span.textContent}')">
        <img src="../img/add-task/clear.png"/>
      </button>
    `;
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
    listContainer.innerHTML = "";
  
    boardSubtasks.forEach(subtask => {
      const subtaskName = Object.keys(subtask)[0];
      const newListElement = document.createElement("li");
      newListElement.classList.add("subtask-list-element");
      newListElement.innerHTML = `
        <span>${subtaskName}</span>
        <div class="subtaskli-buttons-container">
          <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
            <img src="../img/add-task/edit.png"/>
          </button>
          ${verticalSeparator("1px", "24px", "#A8A8A8")}
          <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
            <img src="../img/add-task/delete.png"/>
          </button>
        </div>
      `;
      listContainer.appendChild(newListElement);
    });
}

function boardCancelEditSubtask(button, originalText) {
    const li = button.closest("li");
    li.innerHTML = `
      <span>${originalText}</span>
      <div class="subtaskli-buttons-container">
        <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
          <img src="../img/add-task/edit.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
          <img src="../img/add-task/delete.png"/>
        </button>
      </div>
    `;
}

function boardSaveEditedSubtask(input, li) {
    const updatedText = input.value.trim();
    if (updatedText !== "") {
      li.innerHTML = `
        <span>${updatedText}</span>
        <div class="subtask-buttons-container">
          <button class="in-line-btn edit-subtask-button" type="button" onclick="boardEditSubtask(this)">
            <img src="../img/add-task/edit.png" alt="Edit Subtask"/>
          </button>
          <button class="in-line-btn delete-subtask-button" type="button" onclick="boardDeleteSubtask(this)">
            <img src="../img/add-task/delete.png" alt="Delete Subtask"/>
          </button>
        </div>
      `;
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
  
        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "checkbox-label";
        checkboxLabel.htmlFor = id;
  
        const spanInitials = document.createElement("span");
        spanInitials.className = "initials-span board-task";
        spanInitials.textContent = initials;
  
        const spanFullName = document.createElement("span");
        spanFullName.className = "contact-name";
        spanFullName.textContent = fullNameDisplay;
  
        const checkbox = document.createElement("div");
        checkbox.className = "custom-checkbox";
        checkbox.id = `checkbox-${id}`;
        checkbox.onclick = () => boardAssignContacts(event, id);
  
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



