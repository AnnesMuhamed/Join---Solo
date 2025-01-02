function inlineSubtaskButton(type) {
    return `
          <button id="${type}-subtask-button" class="in-line-btn" type="button">
              <img src="./assets/img/${type}.png"/>
          </button>
      `;
}
  
function inSubtaskListButton(type) {
    return `
          <button class="${type}-subtask-button in-line-btn" type="button">
              <img src="./assets/img/${type}.png"/>
          </button>
      `;
}

function generateClearSubtaskButtonTemplate(idSuffix) {
    return `
      <button id="add-subtask-button${idSuffix}" class="in-line-btn" type="button" onclick="confirmOrCancelSubtask('${idSuffix}')">
        <img src="./assets/img/add.png"/>
      </button>
    `;
}

function generateConfirmOrCancelSubtaskTemplate() {
    return `
      <button class="in-line-btn" type="button" onclick="clearSubtaskInput()">
        <img src="./assets/img/clear.png"/>
      </button>
      ${verticalSeparator("1px", "24px", "#D1D1D1")}
      <button class="in-line-btn" type="button" onclick="renderSubtask()">
        <img src="./assets/img/check.png"/>
      </button>
    `;
}   

function generateSubtaskTemplate(subtask) {
    return `
      <span>${subtask}</span>
      <div class="subtaskli-buttons-container">
        <button class="in-line-btn" type="button" onclick="editSubtask(this)">
          <img src="./assets/img/edit.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="in-line-btn" type="button" onclick="deleteSubtask(this)">
          <img src="./assets/img/delete.png"/>
        </button>
      </div>
    `;
}

