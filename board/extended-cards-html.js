// htmlTemplates.js

// Template für den Inhalt des Popups
function renderPopupContent(taskId, idSuffix = '1') {
    return `
      <button class="popup-cencel-button" onclick="closePopup()">
        <img src="../img/close.png" alt="Close" class="action-icon-x">
      </button>
      <form id="edit-task-form${idSuffix}" class="edit-task-form">
        <div class="d-flex-col inPopup">
          <label class="custom-label" for="title">Titel<span class="star">*</span></label>
          <input type="text" id="title${idSuffix}" class="definition-entry-field" placeholder="Titel eingeben" required>
        </div>
        <div class="d-flex-col inPopup">
          <label for="description">Beschreibung</label>
          <textarea id="description${idSuffix}" class="definition-entry-field" placeholder="Beschreibung eingeben"></textarea>
        </div>
        <div class="d-flex-col inPopup">
          <label class="custom-label" for="due-date">Fälligkeitsdatum<span class="star">*</span></label>
          <input type="date" id="due-date${idSuffix}" class="properties-entry-field" required>
        </div>
        <div class="d-flex-col inPopup">
          <label>Priorität</label>
          <div id="radio-button-group-edit${idSuffix}" class="radio-button-group${idSuffix}">
            <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button${idSuffix}">
            <label for="prio-high" class="radio-label${idSuffix}">
              <span>Dringend</span><img class="rp-prio-img" src="../img/add-task/prio-high.png">
            </label>
            <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button${idSuffix}">
            <label for="prio-med" class="radio-label${idSuffix}">
              <span>Mittel</span><img class="rp-prio-img" src="../img/add-task/prio-med.png">
            </label>
            <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button${idSuffix}">
            <label for="prio-low" class="radio-label${idSuffix}">
              <span>Niedrig</span><img class="rp-prio-img" src="../img/add-task/prio-low.png">
            </label>
          </div>
        </div>
        <div class="d-flex-col assignment-container inPopup">
          <label for="assignment">Kontakte auswählen</label>
          <div class="select-box">
            <input id="search1" class="assignment-selector" type="text" placeholder="Kontakte auswählen" oninput="filterContacts()">
            <div id="dropdownArrow" class="dropdown-arrow" onclick="toggleCheckboxes()"></div>
            <div id="checkboxesDiv" class="d-none">
              <div id="checkboxes1" class="checkboxes-container"></div>
            </div>
          </div>
        </div>
        <div id="assigned-contacts1"></div>
        <div class="d-flex-col inPopup">
          <label for="subtasks">Unteraufgaben</label>
          <div class="subtask-container">
            <input class="properties-entry-field popup-subtaskinput" type="text" id="subtask-input${idSuffix}" placeholder="Neue Unteraufgabe hinzufügen">
            <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
              <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="showSubtaskButtons('${idSuffix}')">
                <img src="../img/add-task/add.png">
              </button>
            </div>
          </div>
        </div>
        <ul id="subtask-list${idSuffix}" class="subtask-list1"></ul>
      </form>
      <button class="popup-save-button" onclick="saveEditedTask('${taskId}')">
        <span class="action-label">Ok</span>
        <img src="../img/hook.png" alt="Speichern" class="action-icon-hook"> 
      </button>`;
  }
  
  // Template für das Info-Popup
  function renderInfoPopup(taskId) {
    return `
    <div class="popup-header">
      <div class="tag-container" id="tag-container"><span class="tag" id="tag"></span></div>
      <button class="close-button" onclick="closePopup()"><img src="../img/close.png" alt="Schließen" class="close-icon" /></button>
    </div>
    <div class="popup-info">
      <h1 class="popup-title" id="popup-title"></h1>
      <h5 class="popup-subtitle" id="popup-subtitle"></h5>
      <div class="info-item-date"><span class="label">Fälligkeitsdatum:</span><span class="value" id="due-date"></span></div>
      <div id="priority-container">
        <span class="label">Priorität:</span>
        <div class="priority-lable-container">
          <span id="priority-label"></span>
          <img id="priority-icon" />
        </div>
      </div>
      <div class="info-item-assigned">
        <span class="label">Zugewiesen an:</span>
        <div id="assignee-container"></div> 
        <div class="popup-subtasks">
          <span class="subtasks-label">Unteraufgaben:</span>
          <div class="subtasks-list" id="subtasks-list"></div>
        </div>
      </div>
    </div>
    <div class="popup-actions">
      <button class="action-button" onclick="deleteTask()">
        <img src="../img/delete.png" alt="Löschen" class="action-icon" /><span class="action-label">Löschen</span>
      </button>
      <img src="../img/high-stroke-gray.png" alt="Trenner" class="action-separator" />
      <button class="action-button" onclick="editTask('${taskId}')">
        <img src="../img/edit-black.png" alt="Bearbeiten" class="action-icon" /><span class="action-label">Bearbeiten</span>
      </button>
    </div>`;
  }


  
  