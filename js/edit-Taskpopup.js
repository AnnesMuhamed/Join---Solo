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
  
  function showSubtaskButtons(idSuffix) {
    const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
    const buttonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
    if (subtaskInput.value.trim()) {
      buttonsContainer.innerHTML = generateSubtaskButtonsTemplate(idSuffix);
    } else {
      resetSubtaskButtons(idSuffix);
    }
  }
  
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
  
  function deleteSubtask(button) {
    const listItem = button.closest('li');
    if (!listItem) return;
    listItem.remove();
  }
  
  
  function resetSubtaskButtons(idSuffix) {
    const subtaskButtonsContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
    subtaskButtonsContainer.innerHTML = generateSubtaskButtonTemplate(idSuffix);
  }
  
  function clearSubtaskInput(idSuffix) {
    const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);
    subtaskInput.value = "";
    resetSubtaskButtons(idSuffix);
  }
  
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
  
  function openEditPopup(taskId) {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.innerHTML = generateEditPopupTemplate();
    populateTaskForm(taskId, '1');
  }
  
  async function loadContacts() {
    contacts = await loadData(pathContacts);
  
    if (contacts) {
      setTimeout(() => {
        renderCheckboxesWithColors();t
      }, 0);
    }
  }
  
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
      console.error(`Fehler beim Aktualisieren der Aufgabe in Firebase: ${error}`);
    }
    renderCards();
    closePopup();
    createOrUpdateProgressBar(taskId);
  }
  
  function closePopup() {
    document.getElementById('popup-container').classList.remove('show');
  }
  
  async function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        try {
            await deleteData(`tasks/${taskId}`);
            let tasks = JSON.parse(sessionStorage.getItem("tasks"));
            delete tasks[taskId];
            sessionStorage.setitem("tasks", JSON.stringify(tasks));
            closePopup();
            renderCards();
        } catch (error) {
            console.error("Fehler beim Löschen der Aufgabe:", error);
        }
    }
  }
  
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
  
  function removeContactFromAssigned(contactId) {
    const span = document.getElementById(`assigned-${contactId}`);
    if (span) {
      span.remove();
    }
  }
  
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
  
  function getContactInitials(contactId) {
    const contacts = JSON.parse(sessionStorage.getItem("contacts")) || {};
    const contact = contacts[contactId];
  
    if (!contact || !contact.firstName || !contact.lastName) {
      return "??"; 
    }
  
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  }
  
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