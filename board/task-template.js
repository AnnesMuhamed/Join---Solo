// Diese Funktion generiert das HTML-Template für das Hinzufügen und Bearbeiten einer Task
function generateNewTaskTemplate(id = ' ', idSuffix = '') {
    return `
     <div id="${id}" class="new-task">
      <button onclick="closeAddTaskForm()" class="close-btn">
        <img class="close-button-icon" src="../img/close.png" alt="" />
      </button>
      <h1 class="add-task-headline">Add Task</h1>
      <form id="add-task-form" class="add-task-form">
        <div class="definition">
          <div class="d-flex-col">
            <label for="title" class="required">Title <span style="color: red">*</span></label>
            <input class="title definition-entry-field" type="text" id="title${idSuffix}" name="title" placeholder="Enter a title" required />
          </div>
          <div class="d-flex-col">
            <label for="description">Description</label>
            <textarea class="description definition-entry-field" id="description${idSuffix}" name="description" placeholder="Enter a Description"></textarea>
          </div>
          <div class="d-flex-col assignment-container">
            <label for="assignment">Assigned to</label>
            <div class="select-box">
              <input id="search${idSuffix}" class="assignment-selector definition-entry-field" type="text" name="assignment" placeholder="Select contacts to assign" />
            </div>
            <div id="checkboxes${idSuffix}"></div>
            <div id="assigned-contacts${idSuffix}"></div>
          </div>
        </div>
        <svg height="424px" width="2" class="seperator">
          <line x1="1" y1="0" x2="1" y2="424" style="stroke: #d1d1d1; stroke-width: 1" />
        </svg>
        <div class="properties">
          <div class="d-flex-col">
            <label for="date" class="required">Due date <span style="color: red">*</span></label>
            <input class="properties-entry-field due-date" type="date" id="date${idSuffix}" name="date" required />
          </div>
          <div class="d-flex-col">
            <label for="radio-button-group">Prio</label>
            <div id="radio-button-group${idSuffix}" class="radio-button-group">
              <input type="radio" id="prio-high${idSuffix}" name="prios" value="3" class="radio-button" />
              <label for="prio-high" class="radio-label"><span>Urgent</span><img class="rp-prio-img" src="../img/add-task/prio-high.png" /></label>
              <input type="radio" id="prio-med${idSuffix}" name="prios" value="2" class="radio-button" />
              <label for="prio-med" class="radio-label"><span>Medium</span><img class="rp-prio-img" src="../img/add-task/prio-med.png" /></label>
              <input type="radio" id="prio-low${idSuffix}" name="prios" value="1" class="radio-button" />
              <label for="prio-low" class="radio-label"><span>Low</span><img class="rp-prio-img" src="../img/add-task/prio-low.png" /></label>
            </div>
          </div>
          <div class="d-flex-col">
            <label for="category" class="required">Category <span style="color: red">*</span></label>
            <select class="category properties-entry-field" id="category${idSuffix}" name="category" required>
              <option disabled selected hidden>Select Task category</option>
              <option>Technical Task</option>
              <option>User Story</option>
            </select>
          </div>
          <div class="d-flex-col">
            <label for="subtasks">Subtasks</label>
            <div class="subtask-container">
              <input class="subtasks properties-entry-field" type="text" id="subtasks${idSuffix}" name="subtasks" placeholder="Add new subtask" />
              <div id="subtask-buttons-container${idSuffix}" class="add-subtask-button">
                <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button"><img src="../img/add-task/add.png" /></button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div id="subtask-list-container${idSuffix}" class="subtask-list-container">
        <ul id="subtask-list${idSuffix}" class="subtask-list"></ul>
      </div>
      <div id="buttons${idSuffix}" class="buttons">
        <span id="requirement${idSuffix}" class="requirement"><span style="color: red">*</span>This field is required</span>
        <div class="btn-container">
          <button id="clear-btn${idSuffix}" class="add-task-btn clear-btn">Clear</button>
          <button id="create-btn${idSuffix}" class="add-task-btn create-task-btn" form="add-task-form" type="submit">Create Task</button>
        </div>
      </div>
    </div>
    `;
}

// Task Formular im HTML einfügen
document.body.innerHTML += generateNewTaskTemplate('editTask', 'Edit');
document.body.innerHTML += generateNewTaskTemplate();
