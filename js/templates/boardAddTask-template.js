function generateBoardSubtaskButtonsTemplate() {
    return `
      <button class="in-line-btn" type="button" onclick="boardClearSubtaskInput()">
        <img src="./assets/img/clear.png"/>
      </button>
      ${verticalSeparator("1px", "24px", "#D1D1D1")}
      <button class="in-line-btn" type="button" onclick="boardRenderSubtask()">
        <img src="./assets/img/check.png"/>
      </button>
    `;
}

  function generateBoardSubtaskTemplate(subtask) {
    return `
      <span>${subtask}</span>
      <div class="subtaskli-buttons-container">
        <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
          <img src="./assets/img/edit.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
          <img src="./assets/img/delete.png"/>
        </button>
      </div>
    `;
}

  function generateBoardClearSubtaskTemplate() {
    return `
      <button id="board-add-subtask-button" class="in-line-btn" type="button" onclick="boardConfirmOrCancelSubtask()">
        <img src="./assets/img/add.png" />
      </button>
    `;
}

function generateBoardEditSubtaskButtonsTemplate(subtaskText) {
    return `
      <button class="in-line-btn" type="button" onclick="boardUpdateSubtask(this, '${subtaskText}')">
        <img src="./assets/img/check.png"/>
      </button>
      ${verticalSeparator("1px", "24px", "#A8A8A8")}
      <button class="in-line-btn" type="button" onclick="boardCancelEditSubtask(this, '${subtaskText}')">
        <img src="./assets/img/clear.png"/>
      </button>
    `;
}

function generateBoardSubtaskListTemplate(subtasks) {
    return subtasks.map(subtask => {
      const subtaskName = Object.keys(subtask)[0];
      return `
        <li class="subtask-list-element">
          <span>${subtaskName}</span>
          <div class="subtaskli-buttons-container">
            <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
              <img src="./assets/img/edit.png"/>
            </button>
            ${verticalSeparator("1px", "24px", "#A8A8A8")}
            <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
              <img src="./assets/img/delete.png"/>
            </button>
          </div>
        </li>
      `;
    }).join('');
}

function generateBoardCancelEditSubtaskTemplate(originalText) {
    return `
      <span>${originalText}</span>
      <div class="subtaskli-buttons-container">
        <button class="in-line-btn" type="button" onclick="boardEditSubtask(this)">
          <img src="./assets/img/edit.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="in-line-btn" type="button" onclick="boardDeleteSubtask(this)">
          <img src="./assets/img/delete.png"/>
        </button>
      </div>
    `;
}

function generateBoardSaveSubtaskTemplate(updatedText) {
    return `
      <span>${updatedText}</span>
      <div class="subtask-buttons-container">
        <button class="in-line-btn edit-subtask-button" type="button" onclick="boardEditSubtask(this)">
          <img src="./assets/img/edit.png" alt="Edit Subtask"/>
        </button>
        <button class="in-line-btn delete-subtask-button" type="button" onclick="boardDeleteSubtask(this)">
          <img src="./assets/img/delete.png" alt="Delete Subtask"/>
        </button>
      </div>
    `;
}