// html-templates.js

function renderInfoPopupHTML(taskId) {
    return /*html*/ `
      <div class="popup-header">
        <div class="tag-container" id="tag-container"><span class="tag" id="Tag"></span></div>
        <button class="close-button" onclick="closePopup()"><img src="../assets/img/close.png" alt="Close" class="close-icon" /></button>
      </div>
      <div class="popup-info">
        <h1 class="popup-title" id="popup-title"></h1>
        <h5 class="popup-subtitle" id="popup-subtitle"></h5>
        <div class="info-item-date"><span class="label">Due date:</span><span class="value" id="due-date"></span></div>
        <div id="priority-container">
          <span class="label">Priority:</span>
          <div class="priority-lable-container">
            <span id="priority-label"></span>
            <img id="priority-icon" />
          </div>
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
        <button class="action-button" onclick="deleteTask('${taskId}')">
          <img src="../assets/img/delete.png" alt="Delete" class="action-icon" />
          <span class="action-label">Delete</span>
        </button>
        <img src="../assets/img/high-stroke-gray.png" alt="Separator" class="action-separator" />
        <button class="action-button" onclick="editTask('${taskId}')">
          <img src="../assets/img/edit-black.png" alt="Edit" class="action-icon" />
          <span class="action-label">Edit</span>
        </button>
      </div>`;
  }
  
  export function renderEditTaskPopupHTML(taskId, idSuffix = '1') {
    return /*html*/ `
      <button class="popup-cencel-button" onclick="closePopup()">
        <img src="../assets/img/close.png" alt="Close" class="action-icon-x">
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
            <label for="prio-high" class="radio-label${idSuffix}"><span>Urgent</span><img class="rp-prio-img" src="../assets/img/prio-high.png"></label>
            <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button${idSuffix}">
            <label for="prio-med" class="radio-label${idSuffix}"><span>Medium</span><img class="rp-prio-img" src="../assets/img/prio-med.png"></label>
            <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button${idSuffix}">
            <label for="prio-low" class="radio-label${idSuffix}"><span>Low</span><img class="rp-prio-img" src="../assets/img/prio-low.png"></label>
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
                <img src="../assets/img/add.png">
              </button>
            </div>
          </div>
        </div>
        <ul id="subtask-list${idSuffix}" class="subtask-list1"></ul>
      </form>
      <button class="popup-save-button" onclick="saveEditedTask('${taskId}')">
        <span class="action-label">Ok</span>
        <img src="../assets/img/hook.png" alt="Save" class="action-icon-hook"> 
      </button>`;
  }

  export function generateSubtaskHTML(subtask, isChecked, taskId, index) {
    const checkboxImg = isChecked ? "../assets/img/checked.png" : "../assets/img/checkbox.png";
  
    return /*html*/ `
      <div class="subtask-popup ${isChecked} ? 'checked' : ''}" data-subtask-id="${taskId}-${index}">
        <div class="subtask-checkbox" onclick="toggleSubtaskCheck('${taskId}', ${index});">
          <img src="${checkboxImg}" alt="Checkbox" id="checkbox-img-${taskId}-${index}">
        </div>
        <span>${Object.keys(subtask)[0]}</span>
      </div>`;
  }
  
  export function noSubtasksHTML() {
    return /*html*/ `<span>You have no subtasks</span>`;
  }

  export function renderInfoPopup(taskId){
  return /*html*/`
      <div class="popup-header">
            <div class="tag-container" id="tag-container"><span class="tag" id="Tag"></span></div>
            <button class="close-button" onclick="closePopup()"><img src="../assets/img/close.png" alt="Close" class="close-icon" /></button>
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
            <button class="action-button" onclick="deleteTask('${taskId}')"><img src="../assets/img/delete.png" alt="Delete" class="action-icon" /><span class="action-label">Delete</span></button>
            <img src="../assets/img/high-stroke-gray.png" alt="Separator" class="action-separator" />
            <button class="action-button" onclick="editTask('${taskId}')"><img src="../assets/img/edit-black.png" alt="Edit" class="action-icon" /><span class="action-label">Edit</span></button>
        </div>`;
}
  
