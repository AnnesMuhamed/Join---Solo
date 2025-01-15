/**
 * Opens the task editing popup by loading the editing content, populating the form with task details, 
 * and displaying the popup container.
 * 
 * @param {string} taskId - The ID of the task to edit.
 * @param {string} [idSuffix='1'] - The suffix used for element IDs in the editing form.
 */
function editTask(taskId, idSuffix = '1') {
  const popupContainer = document.querySelector('.popup-container');
  const popupContent = document.getElementById('popup');

  fetch('add-task-content.html')
    .then(response => response.text())
    .then(() => {
      popupContent.innerHTML = editTaskInnerHTML(taskId, idSuffix);
    })
    .then(() => {
      if (document.getElementById(`title${idSuffix}`)) {
        populateTaskForm(taskId, idSuffix);
        popupContainer.classList.add('show');
      } else {
        console.error("HTML-Elemente nicht gefunden!");
      }
    });
}
  
/**
 * Displays buttons for managing subtasks when there is input in the subtask field, 
 * and resets the buttons if the input is empty.
 * 
 * @param {string} idSuffix - The suffix used for element IDs in the subtask input and buttons container.
 */
function showSubtaskButtons(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const buttonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  if (subtaskInput.value.trim()) {
      buttonsContainer.innerHTML = generateSubtaskButtonsTemplate(idSuffix);
  } else {
      resetSubtaskButtons(idSuffix);
  }
}
  
/**
 * Adds a new subtask to the subtask list if the input field contains a non-empty value,
 * clears the input field, and resets the subtask buttons.
 * 
 * @param {string} idSuffix - The suffix used for element IDs in the subtask input and list.
 */
function confirmSubtask(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  const subtaskList = document.getElementById(`subtask-list${idSuffix}`);
  const newSubtaskValue = subtaskInput.value.trim();
  if (newSubtaskValue === "") {
      return;
  }

  const newListItem = document.createElement("li");
  newListItem.classList.add("subtask-list-element");
  newListItem.innerHTML = generateSubtaskHTML(newSubtaskValue, idSuffix);

  subtaskList.appendChild(newListItem);
  subtaskInput.value = "";
  resetSubtaskButtons(idSuffix);
}
  
/**
 * Enables editing of a subtask by replacing its text with an input field,
 * and adding save and delete buttons for managing the subtask.
 * 
 * @param {HTMLElement} button - The button element that triggered the edit action.
 */
function editSubtask(button) {
  const listItem = button.closest('li');
  if (!listItem) return;

  listItem.classList.add('editing');
  const subtaskText = listItem.querySelector('span').textContent;
  const inputContainer = document.createElement("div");
  inputContainer.classList.add('input-container');

  const input = document.createElement("input");
  input.type = "text";
  input.value = subtaskText;
  input.classList.add("edit-input");

  const saveButton = document.createElement("button");
  saveButton.innerHTML = `<img src="./assets/img/success.png" alt="Save">`;
  saveButton.classList.add("save-button");
  saveButton.onclick = function(event) {
      event.preventDefault();
      saveSubtask(listItem, input.value);
  };
  
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="./assets/img/delete.png" alt="Delete">`;
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = (event) => {
      event.stopPropagation();
      deleteSubtask(listItem);
  };

  inputContainer.appendChild(input);
  inputContainer.appendChild(saveButton);
  inputContainer.appendChild(deleteButton);
  listItem.innerHTML = ""; 
  listItem.appendChild(inputContainer);
  input.focus();
}
  
/**
 * Deletes a subtask by removing its corresponding list item element from the DOM.
 * 
 * @param {HTMLElement} button - The button element that triggered the delete action.
 */
function deleteSubtask(button) {
  const listItem = button.closest('li');
  if (!listItem) return;
  listItem.remove();
}  
  
  /**
 * Resets the subtask buttons container by generating and setting the default button template.
 * 
 * @param {string} idSuffix - The suffix used for the subtask buttons container ID.
 */
function resetSubtaskButtons(idSuffix) {
  const subtaskButtonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  subtaskButtonsContainer.innerHTML = generateSubtaskButtonTemplate(idSuffix);
}
  
/**
 * Clears the subtask input field and resets the subtask buttons to their default state.
 * 
 * @param {string} idSuffix - The suffix used for the subtask input and buttons container IDs.
 */
function clearSubtaskInput(idSuffix) {
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
  subtaskInput.value = "";
  resetSubtaskButtons(idSuffix);
}
  
/**
 * Populates the task form with the details of a specific task, including title, description, 
 * due date, priority, assigned contacts, and subtasks.
 * 
 * @param {string} taskId - The ID of the task to populate the form with.
 * @param {string} idSuffix - The suffix used for element IDs in the form.
 */
function populateTaskForm(taskId, idSuffix) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks ? tasks[taskId] : null;

  if (!task) {
      return;
  }

  document.getElementById(`title${idSuffix}`).value = task.title || '';
  document.getElementById(`description${idSuffix}`).value = task.description || '';
  document.getElementById(`due-date${idSuffix}`).value = task.date || '';

  let priorityElement = document.querySelector(`input[name="prios"][value="${task.priority}"]`);
  if (priorityElement) {
      priorityElement.checked = true;
  }

  let assignees = task.assignment ? task.assignment.split(',') : [];
  selectedContacts = new Set(assignees);
  let subtasks = JSON.parse(task.subtasks || "[]");
  let subtaskList = document.getElementById('subtask-list1');
  if (subtaskList) {
      subtaskList.innerHTML = '';
      subtasks.forEach((subtask, index) => {
          let key = Object.keys(subtask)[0];
          subtaskList.innerHTML += generateSubtaskItemTemplate(key, idSuffix);
      });
  }

  renderCheckboxesWithColors();
  updateAssignedContacts();
}
  
/**
 * Opens the edit popup for a specific task by generating the edit popup template 
 * and populating the form with the task's details.
 * 
 * @param {string} taskId - The ID of the task to be edited.
 */
function openEditPopup(taskId) {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.innerHTML = generateEditPopupTemplate();
  populateTaskForm(taskId, '1');
}
  
/**
 * Loads the contacts data asynchronously and renders the checkboxes with colors 
 * once the contacts are successfully loaded.
 */
async function loadContacts() {
  contacts = await loadData(pathContacts);

  if (contacts) {
      setTimeout(() => {
          renderCheckboxesWithColors();
      }, 0);
  }
}
  
/**
 * Renders all task cards by clearing the existing content in the task containers 
 * and adding cards based on the current state of each task.
 */
function renderCards() {
  let tasks = JSON.parse(sessionStorage.getItem("tasks")) || {};
  let allTaskCardsContainer = document.querySelectorAll(".drag-area");

  if (!allTaskCardsContainer || allTaskCardsContainer.length === 0) {
      return;
  }

  allTaskCardsContainer.forEach((column) => {
      if (column) {
          column.innerHTML = ""; 
      }
  });

  Object.keys(tasks).forEach((key) => {
      let task = tasks[key];
      let stateColumn = document.getElementById(task.state);

      if (stateColumn) {
          createCard(key, stateColumn, task);
      }
  });
}
  
/**
 * Saves the edited task by updating its details from the form, storing the changes in sessionStorage,
 * and synchronizing them with the database. Also updates the UI and progress bar.
 * 
 * @param {string} taskId - The ID of the task being edited.
 */
async function saveEditedTask(taskId) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks ? tasks[taskId] : null;

  if (!task) {
      return;
  }

  let titleInput = document.getElementById('title1');
  let descriptionInput = document.getElementById('description1');
  let dateInput = document.getElementById('due-date1');
  let priorityInput = document.querySelector('input[name="prios"]:checked');

  if (titleInput) task.title = titleInput.value.trim() !== "" ? titleInput.value : task.title;
  if (descriptionInput) task.description = descriptionInput.value.trim() !== "" ? descriptionInput.value : task.description;
  if (dateInput) task.date = dateInput.value.trim() !== "" ? dateInput.value : task.date;
  if (priorityInput) task.priority = priorityInput.value;

  let selectedAssignees = Array.from(selectedContacts);
  task.assignment = selectedAssignees.length > 0 ? selectedAssignees.join(',') : "";

  let subtasks = [];
  document.querySelectorAll('#subtask-list1 .subtask-list-element').forEach(item => {
      let subtaskText = item.querySelector('span').textContent;
      let subtaskChecked = "open";
      subtasks.push({ [subtaskText]: subtaskChecked });
  });
  task.subtasks = JSON.stringify(subtasks);

  tasks[taskId] = task;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));

  try {
      await updateData(`tasks/${taskId}`, task);
  } catch (error) {
      console.error(`Error updating task in Firebase: ${error}`);
  }
  renderCards();
  closePopup();
  createOrUpdateProgressBar(taskId);
}

/**
 * Closes the popup by removing the "show" class from the popup container element.
 */
function closePopup() {
  document.getElementById('popup-container').classList.remove('show');
}

/**
* Deletes a task after user confirmation by removing it from the database and session storage,
* then updates the UI by closing the popup and re-rendering the task cards.
* 
* @param {string} taskId - The ID of the task to delete.
*/
async function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
      try {
          await deleteData(`tasks/${taskId}`);
          let tasks = JSON.parse(sessionStorage.getItem("tasks"));
          delete tasks[taskId];
          sessionStorage.setItem("tasks", JSON.stringify(tasks));
          closePopup();
          renderCards();
      } catch (error) {
          console.error("Error deleting the task:", error);
      }
  }
}

/**
 * Toggles the visibility of the checkboxes container by adding or removing the "d-none" class.
 */
function toggleCheckboxes() {
  const checkboxes = document.getElementById("checkboxesdiv");

  if (!checkboxes) {
      return;
  }

  if (checkboxes.classList.contains("d-none")) {
      checkboxes.classList.remove("d-none"); 
  } else {
      checkboxes.classList.add("d-none");
  }
}
  
/**
 * Renders the checkboxes for contacts with their initials and colors, 
 * populating the container with the current contact data.
 */
function renderCheckboxesWithColors() {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const checkboxesContainer = document.getElementById("checkboxes1");

  if (!checkboxesContainer) {
      return;
  }

  checkboxesContainer.innerHTML = "";

  Object.keys(contacts).forEach(contactId => {
      const contact = contacts[contactId];
      const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
      const isChecked = selectedContacts.has(contactId);
      const contactColor = contact.color || "#000000";

      checkboxesContainer.innerHTML += renderCheckboxTemplate(contactId, initials, contactColor, isChecked, contact);
  });
}
  
/**
 * Toggles the selection state of a contact, adding or removing it from the selected contacts set,
 * and updates the UI by highlighting the contact label and checkbox, as well as updating assigned contacts.
 * 
 * @param {string} contactId - The ID of the contact to toggle.
 */
function toggleContact(contactId) {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contactLabel = document.getElementById(`contact-${contactId}`);
  const checkbox = document.getElementById(`checkbox-${contactId}`);
  
  if (!contacts[contactId]) {
      return;
  }

  const isSelected = selectedContacts.has(contactId);

  if (isSelected) {
      selectedContacts.delete(contactId);
      contactLabel.classList.remove("highlighted");
      if (checkbox) checkbox.checked = false;
      removeContactFromAssigned(contactId);
  } else {
      selectedContacts.add(contactId);
      contactLabel.classList.add("highlighted");
      if (checkbox) checkbox.checked = true;
      addContactToAssigned(contactId);
  }
  updateAssignedContacts();
}
  
/**
 * Adds a contact to the list of assigned contacts in the UI by creating a span element 
 * with the contact's initials and color, and appending it to the assigned contacts container.
 * 
 * @param {string} contactId - The ID of the contact to add to the assigned list.
 */
function addContactToAssigned(contactId) {
  const assignedDiv = document.getElementById("assigned-contacts1");
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contact = contacts[contactId];

  if (!contact) {
      return;
  }

  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const assignedColor = contact.color || "#000000";
  const span = document.createElement("span");
  span.classList.add("initials-popup-span");
  span.id = `assigned-${contactId}`;
  span.style.backgroundColor = assignedColor;
  span.textContent = initials;

  assignedDiv.appendChild(span);
}
  
/**
 * Removes a contact from the list of assigned contacts in the UI by removing the span element
 * associated with the contact's ID.
 * 
 * @param {string} contactId - The ID of the contact to remove from the assigned list.
 */
function removeContactFromAssigned(contactId) {
  const span = document.getElementById(`assigned-${contactId}`);
  if (span) {
      span.remove();
  }
}

  
/**
 * Updates the list of assigned contacts in the UI by clearing the existing content 
 * and adding span elements for all currently selected contacts.
 */
function updateAssignedContacts() {
  const assignedDiv = document.getElementById("assigned-contacts1");
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  assignedDiv.innerHTML = "";
  selectedContacts.forEach(contactId => {
      const contact = contacts[contactId];
      if (contact) {
          const initials = getContactInitials(contactId);
          const assignedColor = contact.color || "#000000";

          const span = document.createElement("span");
          span.classList.add("initials-popup-span");
          span.id = `assigned-${contactId}`;
          span.style.backgroundColor = assignedColor;
          span.textContent = initials;

          assignedDiv.appendChild(span);
      }
  });
}
  
/**
 * Retrieves the initials of a contact based on the contact's ID by extracting the first characters 
 * of the contact's first and last name. Returns "??" if the contact data is incomplete or missing.
 * 
 * @param {string} contactId - The ID of the contact.
 * @returns {string} - The initials of the contact or "??" if unavailable.
 */
function getContactInitials(contactId) {
  const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
  const contact = contacts[contactId];

  if (!contact || !contact.firstName || !contact.lastName) {
      return "??"; 
  }

  return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
}

/**
* Saves the edited value of a subtask by replacing the input field with the updated subtask content
* and removing the editing class from the list item.
* 
* @param {HTMLElement} listItem - The list item element containing the subtask to update.
* @param {string} newValue - The new value for the subtask.
*/
function saveSubtask(listItem, newValue) {
  if (!listItem) {
      return;
  }

  if (newValue.trim() === "") {
      return;
  }

  listItem.classList.remove('editing');
  listItem.innerHTML = subtaskTemplate(newValue);
}