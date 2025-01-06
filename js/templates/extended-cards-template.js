function editTaskInnerHTML(taskId, idSuffix = '1') {
    return` <button class="popup-cencel-button"  type="button" onclick="closePopup()">
          <img src="./assets/img/close.png" alt="Close" class="action-icon-x">
            </button>
        <form id="edit-task-form${idSuffix}" class="edit-task-form">
            <div class="d-flex-col inpopup">
            <label class="custom-label" for="title">Title
            <span class="star">*</span>
            </label>
            <input type="text" id="title${idSuffix}" class="definition-entry-field" placeholder="Enter a title" required>
            </div>
            <div class="d-flex-col inpopup">
            <label for="description">Description</label>
            <textarea id="description${idSuffix}" class="definition-entry-field" placeholder="Enter a description"></textarea>
            </div>
            <div class="d-flex-col inpopup">
            <label class="custom-label" for="due-date">Due date
            <span class="star">*</span>
            </label>
            <input type="date" id="due-date${idSuffix}" class="properties-entry-field" required>
            </div>
            <div class="d-flex-col inpopup">
            <label>Priority</label>
            <div id="radio-button-group-edit${idSuffix}" class="radio-button-group${idSuffix}">
                <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button${idSuffix}">
                <label for="prio-high" class="radio-label${idSuffix}"><span>Urgent</span><img class="rp-prio-img" src="./assets/img/prio-high.png"></label>
                <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button${idSuffix}">
                <label for="prio-med" class="radio-label${idSuffix}"><span>Medium</span><img class="rp-prio-img" src="./assets/img/prio-med.png"></label>
                <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button${idSuffix}">
                <label for="prio-low" class="radio-label${idSuffix}"><span>Low</span><img class="rp-prio-img" src="./assets/img/prio-low.png"></label>
            </div>
            </div>
            <div class="d-flex-col assignment-container inpopup">
            <label for="assignment">Select contacts to assign</label>
            <div class="select-box">
                <input id="search1" class="assignment-selector" type="text" placeholder="Select contacts to assign" oninput="filterContacts()">
                <div id="dropdownarrow" class="dropdown-arrow" onclick="toggleCheckboxes()"></div>
                <div id="checkboxesdiv" class="d-none">
                <div id="checkboxes1" class="checkboxes-container"></div>
                </div>
            </div>
            </div>
            <div id="assigned-contacts1"></div>
            <div class="d-flex-col inpopup">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
            <input class="properties-entry-field popup-subtaskinput" type="text" id="subtask-input${idSuffix}" placeholder="Add new subtask">
            <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
            <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
            <img src="./assets/img/add.png">
            </button>
            </div>
            </div>
            </div>
            <ul id="subtask-list${idSuffix}" class="subtask-list1"></ul>
        </form>
        <button class="popup-save-button" type="button" onclick="saveEditedTask('${taskId}')">
            <span class="action-label">Ok</span>
            <img src="./assets/img/hook.png" alt="Save" class="action-icon-hook"> 
        </button>
    `;
}

function renderInfoPopup(taskId){
    return /*html*/`
        <div class="popup-header">
              <div class="tag-container" id="tag-container"><span class="tag" id="Tag"></span></div>
              <button class="close-button" type="button" onclick="closePopup()"><img src="./assets/img/close.png" alt="Close" class="close-icon" /></button>
            </div>
            <div class="popup-info">
            <h1 class="popup-title" id="popup-title"></h1>
            <h5 class="popup-subtitle" id="popup-subtitle"></h5>
              <div class="info-item-date"><span class="label">Due date:</span><span class="value" id="due-date"></span></div>
              <div id="priority-container">
                <span class="label">Priority:</span>
                <div class="priority-lable-container">
                  <span id="priority-label"></span>
                  <img id="priority-icon" /></div>
                </div>
              <div class="info-item-assigned">
                <span class="label">Assigned To:</span>
                <div id="assignee-container"></div> 
                <div class="popup-subtasks">
              <span class="subtasks-label">Subtasks:</span>
              <div class="subtasks-list" id="subtasks-list"></div>
            </div>
              </div>
            </div>
            <div class="popup-actions">
              <button class="action-button" type="button" onclick="deleteTask('${taskId}')"><img src="./assets/img/delete.png" alt="Delete" class="action-icon" /><span class="action-label">Delete</span></button>
              <img src="./assets/img/high-stroke-gray.png" alt="Separator" class="action-separator" />
              <button class="action-button" type="button" onclick="editTask('${taskId}')"><img src="./assets/img/edit-black.png" alt="Edit" class="action-icon" /><span class="action-label">Edit</span></button>
        </div>`;
}

function generateSubtaskHTML(subtaskValue, idSuffix) {
    return `
      <span>${subtaskValue}</span>
      <div class="subtask-li-btn-container">
        <button class="sutbtask-hover-btn" type="button" onclick="editSubtask(this, event)">
          <img src="./assets/img/edit-black.png" alt="Edit">
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="sutbtask-hover-btn" type="button" onclick="deleteSubtask(this, event)">
          <img src="./assets/img/delete.png" alt="Delete">
        </button>
      </div>
    `;
}

  function subtaskTemplate(subtaskValue) {
    return `
      <span>${subtaskValue}</span>
      <div class="subtask-li-btn-container">
        <button class="sutbtask-hover-btn" type="button" onclick="editSubtask(this, event)">
          <img src="./assets/img/edit-black.png" alt="Edit">
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="sutbtask-hover-btn" type="button" onclick="deleteSubtask(this, event)">
          <img src="./assets/img/delete.png" alt="Delete">
        </button>
      </div>
    `;
}

  function renderCheckboxTemplate(contactId, initials, contactColor, isChecked, contact) {
    return `
      <label class="popup-toggle-contacts ${isChecked ? "highlighted" : ""}" id="contact-${contactId}">
        <div class="initials-names-toggle">
          <span class="initials-span" style="background-color:${contactColor};">${initials}</span>
          <span class="popup-toggle-contact-names">${contact.firstName} ${contact.lastName}</span>
        </div>
        <input 
          type="checkbox" 
          id="checkbox-${contactId}" 
          ${isChecked ? "checked" : ""} 
          onclick="toggleContact('${contactId}')"
        />
        <div class="popup-contact-checkboxImg"></div> <!-- Benutzerspezifische Checkbox -->
      </label>
    `;
}
  
function generateEditPopupTemplate() {
    return `
      <div class="popup" id="popup">
        <form id="edit-task-form1" class="edit-task-form">
          <div id="checkboxes"></div> <!-- Erstelle den Checkboxes-Container -->
        </form>
      </div>
    `;
}

function generateSubtaskItemTemplate(subtaskKey, idSuffix) {
    return `
      <li class="subtask-list-element">
        <span>${subtaskKey}</span>
        <div class="subtask-li-btn-container">
          <button class="sutbtask-hover-btn" type="button" onclick="editSubtask(this, '${idSuffix}')">
            <img src="./assets/img/edit-black.png" alt="Edit">
          </button>
          ${verticalSeparator("1px", "24px", "#A8A8A8")}
          <button class="sutbtask-hover-btn" type="button" onclick="deleteSubtask(this, '${idSuffix}')">
            <img src="./assets/img/delete.png" alt="Delete">
          </button>
        </div>
      </li>
    `;
}

function generateSubtaskButtonTemplate(idSuffix) {
    return `
      <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
        <img src="./assets/img/add.png">
      </button>
    `;
}
function generateSubtaskButtonsTemplate(idSuffix) {
    return `
      <button class="sutbtask-hover-btn" type="button" onclick="clearSubtaskInput('${idSuffix}')">
        <img src="./assets/img/close.png" alt="Save" class="">
      </button>
      <button class="sutbtask-hover-btn" type="button" onclick="confirmSubtask('${idSuffix}', event)">
        <img src="./assets/img/success.png" alt="Save" class=""> 
      </button>
    `;
}

function generateAssigneeTemplate(contact) {
    let contactColor = contact.color || "#000000";
    return `
      <div class="assignee-undercontainer">
        <div class="assignee-initials" style="background-color:${contactColor}">
          ${getAssignedContactInitials(contact.firstName, contact.lastName)}
        </div>
        <span class="assignee-name">${contact.firstName} ${contact.lastName}</span>
      </div>
    `;
}
  
function generateSubtaskListTemplate(task, taskId) {
    let subtasks = JSON.parse(task.subtasks || "[]");

        if (subtasks.length === 0) {
            return "<span>You have no subtasks</span>";
        } else {
            return subtasks.map((subtask, index) => {
            let key = Object.keys(subtask)[0];
            let isChecked = subtask[key] === "done";
            let checkboxImg = isChecked ? "./assets/img/checked.png" : "./assets/img/checkbox.png";
            return `
                <div class="subtask-popup ${isChecked ? 'checked' : ''}" data-subtask-id="${taskId}-${index}">
                <div class="subtask-checkbox" onclick="toggleSubtaskCheck('${taskId}', ${index});">
                    <img src="${checkboxImg}" alt="Checkbox" id="checkbox-img-${taskId}-${index}">
                </div>
                <span>${key}</span>
                </div>
            `;
            }).join('');
        }
}
  