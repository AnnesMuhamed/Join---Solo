"use strict";

let boardPathTasks = "tasks";
let boardSubtasks = [];
let boardAssignedContacts = [];
let boardPriority = null;
let boardExpanded = false; 

/**
 * Initializes the Board Add Task form by loading contacts and rendering checkboxes.
 * @async
 */
async function initBoardAddTask() {
  await loadBoardContacts();
  renderBoardCheckboxes();
}
  
/**
 * Creates a new task for the board, validates inputs, and saves it to Firebase.
 * @param {Event} event - The event object from the form submission.
 * @async
 */
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

/**
 * Creates a JSON object representing a new task for the board.
 * @returns {Object} The task JSON object.
 */
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

/**
 * Loads board contacts from session storage and renders checkboxes if available.
 * @async
 */
async function loadBoardContacts() {
  let contacts = JSON.parse(sessionStorage.getItem("contacts"));
  if (contacts) {
      renderBoardCheckboxes();
  } else {
      console.error("Kontakte konnten nicht geladen werden.");
  }
}

/**
 * Renders the checkboxes for board contacts with their initials, names, and colors.
 */
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

/**
 * Toggles the visibility of the board checkboxes and renders them if expanded.
 */
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

/**
 * Toggles the assignment of a contact to a task, updating the UI and the assigned contacts list.
 * @param {Event} event - The click event from the checkbox.
 * @param {string} id - The ID of the contact being assigned or unassigned.
 */
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
      // Unassign contact
      checkbox.classList.remove("checked");
      label.classList.remove("checked");
      document.getElementById(`assigned-${id}`).remove();
      removeBoardContact(id);
  } else {
      // Assign contact
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

/**
 * Adds a contact to the list of assigned board contacts.
 * @param {string} contactId - The ID of the contact to add.
 */
function addBoardContacts(contactId) {
  if (boardAssignedContacts.length > 0) {
      boardAssignedContacts += `,${contactId}`;
  } else {
      boardAssignedContacts = contactId;
  }
}

/**
* Removes a contact from the list of assigned board contacts.
* @param {string} contactId - The ID of the contact to remove.
*/
function removeBoardContact(contactId) {
  const index = boardAssignedContacts.indexOf(contactId);
  if (index !== -1) {
      boardAssignedContacts.splice(index, 1);
  }
}

/**
* Confirms or cancels the addition of a board subtask by updating the buttons dynamically.
*/
function boardConfirmOrCancelSubtask() {
  const subtaskButtonContainer = document.getElementById('board-subtask-buttons-container');
  const subtask = document.getElementById('board-subtasks').value.trim();

  if (subtask) {
      subtaskButtonContainer.innerHTML = generateBoardSubtaskButtonsTemplate();
  }
}

/**
* Renders a new subtask in the board's subtask list and clears the input field.
*/
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

/**
 * Clears the subtask input field and resets the subtask buttons for the board.
 */
function boardClearSubtaskInput() {
  const subtaskButtonContainer = document.getElementById("board-subtask-buttons-container");
  const subtask = document.getElementById("board-subtasks");
  subtask.value = "";
  subtaskButtonContainer.innerHTML = generateBoardClearSubtaskTemplate();
}

/**
 * Retrieves the value of the board title input field.
 * @returns {string} The title value.
 */
function getBoardTitle() {
  let title = document.getElementById("board-title");
  return title.value;
}

/**
 * Retrieves the value of the board description input field.
 * @returns {string} The description value.
 */
function getBoardDescription() {
  let description = document.getElementById("board-description");
  return description.value;
}

/**
 * Toggles the visibility of the board checkboxes.
 */
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

/**
 * Handles assigning or unassigning board contacts based on checkbox interactions.
 * @param {Event} event - The event object from the checkbox interaction.
 */
function assignBoardContacts(event) {
  console.log("Board assignContacts aufgerufen für:", event.target.id);
  let assignments = document.getElementById("board-assigned-contacts");
  let checkboxId = event.target.id.replace("board-", "");
  let initials = `${contacts[checkboxId].firstName.charAt(0)}${contacts[checkboxId].lastName.charAt(0)}`;
  let initialsElement = document.getElementById(`board-${checkboxId}-${initials}`);

  if (event.target.checked) {
      // Assign contact
      if (!initialsElement) {
          let newSpan = document.createElement("span");
          newSpan.className = "initials-span board-task";
          newSpan.id = `board-${checkboxId}-${initials}`;
          newSpan.textContent = initials;
          assignments.appendChild(newSpan);
          addBoardContacts(checkboxId);
      }
  } else {
      // Unassign contact
      if (initialsElement) {
          initialsElement.remove();
          removeBoardContacts(checkboxId);
      }
  }
}

/**
 * Removes a contact from the list of assigned board contacts.
 * @param {string} contactId - The ID of the contact to be removed.
 */
function removeBoardContacts(contactId) {
  if (!Array.isArray(boardAssignedContacts)) {
      boardAssignedContacts = [];
  }

  const index = boardAssignedContacts.indexOf(contactId);
  if (index !== -1) {
      boardAssignedContacts.splice(index, 1);
  }
}

/**
 * Clears the board add task form by resetting fields, clearing arrays, and emptying displayed lists.
 */
function boardClearForm() {
  document.getElementById("board-add-task-form").reset();
  boardPriority = null;
  boardSubtasks = [];
  boardAssignedContacts = [];
  document.getElementById("board-assigned-contacts").innerHTML = "";
  document.getElementById("board-subtask-list").innerHTML = "";
}

/**
 * Edits a subtask by replacing the display text with an input field and edit buttons.
 * @param {HTMLElement} button - The button element that triggered the edit.
 */
function boardEditSubtask(button) {
  const li = button.closest("li");
  const span = li.querySelector("span");
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.classList.add("edit-subtask-input");

  // Clear existing content and replace with input field
  li.innerHTML = "";
  li.appendChild(input);

  // Create and append buttons for confirming or canceling the edit
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "edit-subtask-buttons-container";
  buttonsContainer.innerHTML = generateBoardEditSubtaskButtonsTemplate(span.textContent);
  li.appendChild(buttonsContainer);
}

/**
 * Updates an existing subtask with a new name and refreshes the subtask list.
 * @param {HTMLElement} button - The button element that triggered the update.
 * @param {string} oldSubtask - The original name of the subtask being updated.
 */
function boardUpdateSubtask(button, oldSubtask) {
  const li = button.closest("li");
  const input = li.querySelector("input");
  const newSubtask = input.value.trim();

  if (newSubtask) {
      // Update the subtask in the boardSubtasks array
      boardSubtasks = boardSubtasks.map(subtask =>
          subtask[oldSubtask] ? { [newSubtask]: subtask[oldSubtask] } : subtask
      );

      // Re-render the updated subtask list
      boardRenderSubtaskList();
  }
}

/**
 * Renders the subtask list for the board using the provided subtasks.
 */
function boardRenderSubtaskList() {
  const listContainer = document.getElementById("board-subtask-list");
  listContainer.innerHTML = generateBoardSubtaskListTemplate(boardSubtasks);
}

/**
 * Cancels the editing of a subtask and restores the original text.
 * @param {HTMLElement} button - The button element that triggered the cancel action.
 * @param {string} originalText - The original text of the subtask to restore.
 */
function boardCancelEditSubtask(button, originalText) {
  const li = button.closest("li");
  li.innerHTML = generateBoardCancelEditSubtaskTemplate(originalText);
}

/**
 * Saves the edited subtask text and updates the subtask item in the list.
 * @param {HTMLInputElement} input - The input element containing the updated text.
 * @param {HTMLElement} li - The list item element to update.
 */
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

/**
 * Filters the displayed checkboxes based on the search input value.
 */
function boardFilterCheckboxes() {
  const filterValue = document.getElementById("board-search").value.toLowerCase();
  const contacts = JSON.parse(sessionStorage.getItem("contacts"));
  const checkboxes = document.getElementById("board-checkboxes");
  checkboxes.innerHTML = "";

  for (let id in contacts) {
      const contact = contacts[id];
      const fullName = `${contact.firstName.toLowerCase()} ${contact.lastName.toLowerCase()}`;

      if (fullName.includes(filterValue)) {
          // Create checkbox label
          const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
          const fullNameDisplay = `${contact.firstName} ${contact.lastName}`;
          const contactColor = contact.color || "#000000";
          
          const checkboxLabel = document.createElement("label");
          checkboxLabel.className = "checkbox-label";
          checkboxLabel.htmlFor = id;

          // Create initials span
          const spanInitials = document.createElement("span");
          spanInitials.className = "initials-span board-task";
          spanInitials.textContent = initials;
          spanInitials.style.backgroundColor = contactColor;

          // Create full name span
          const spanFullName = document.createElement("span");
          spanFullName.className = "contact-name";
          spanFullName.textContent = fullNameDisplay;

          // Create checkbox
          const checkbox = document.createElement("div");
          checkbox.className = "custom-checkbox";
          checkbox.id = `checkbox-${id}`;
          checkbox.onclick = (event) => boardAssignContacts(event, id);

          // Append elements
          checkboxLabel.appendChild(spanInitials);
          checkboxLabel.appendChild(spanFullName);
          checkboxLabel.appendChild(checkbox);
          checkboxes.appendChild(checkboxLabel);
      }
  }
}

/**
 * Sets the priority level for the board task and updates the UI accordingly.
 * @param {string} level - The priority level ('high', 'medium', or 'low').
 */
function boardSetPrio(level) {
  const labels = document.querySelectorAll('#board-radio-button-group .radio-label');

  // Reset all labels and images to default state
  labels.forEach(label => {
      label.classList.remove('urgent', 'medium', 'low');
      label.querySelector('img').style.filter = "invert(0%)";
  });

  // Set the appropriate priority level
  if (level === 'high') {
      document.getElementById('board-prio-high').checked = true;
      const highLabel = document.querySelector('label[for="board-prio-high"]');
      highLabel.classList.add('urgent');
      highLabel.querySelector('img').style.filter = "invert(100%)";
      boardPriority = 3;
  } else if (level === 'medium') {
      document.getElementById('board-prio-med').checked = true;
      const mediumLabel = document.querySelector('label[for="board-prio-med"]');
      mediumLabel.classList.add('medium');
      mediumLabel.querySelector('img').style.filter = "invert(100%)";
      boardPriority = 2;
  } else if (level === 'low') {
      document.getElementById('board-prio-low').checked = true;
      const lowLabel = document.querySelector('label[for="board-prio-low"]');
      lowLabel.classList.add('low');
      lowLabel.querySelector('img').style.filter = "invert(100%)";
      boardPriority = 1;
  }
}



