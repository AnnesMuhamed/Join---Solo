let subtasks = [];  // Array zur Speicherung der Subtasks

function addSubtask() {
  let subtaskInput = document.getElementById("subtasks1");  // Input-Feld für Subtask
  let subtaskText = subtaskInput.value.trim();  // Hole den Text der Subtask

  if (subtaskText) {
    subtasks.push({ [subtaskText]: "open" });  // Füge die neue Subtask zum Array hinzu
    renderSubtasks();  // Aktualisiere die Subtask-Liste in der UI
    subtaskInput.value = "";  // Leere das Input-Feld nach dem Hinzufügen
  }
}

function renderSubtasks() {
  let subtaskList = document.getElementById("subtask-list1");  // UL für Subtasks
  subtaskList.innerHTML = "";  // Leere die Liste

  subtasks.forEach((subtaskObj, index) => {
    let subtaskText = Object.keys(subtaskObj)[0];  // Subtask-Text
    let subtaskStatus = subtaskObj[subtaskText];   // Subtask-Status (open/done)

    // Erstelle das HTML für die Subtask
    let listItem = document.createElement("li");
    listItem.classList.add("subtask-list-element");
    listItem.innerHTML = `
      <span>${subtaskText}</span>
      <div class="subtaskli-buttons-container">
        ${inSubtaskListButton("edit")}
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        ${inSubtaskListButton("delete")}
      </div>
    `;
    
    // Hänge das Listenelement an die UL an
    subtaskList.appendChild(listItem);

    // Event Listener für das Bearbeiten und Löschen
    listItem.querySelector(".edit-subtask-button").addEventListener("click", () => editSubtask(index));
    listItem.querySelector(".delete-subtask-button").addEventListener("click", () => deleteSubtask(index));
  });
}

function editSubtask(index) {
    let subtaskObj = subtasks[index];
    let subtaskText = Object.keys(subtaskObj)[0];
  
    // Erstelle ein Eingabefeld zur Bearbeitung
    let input = document.createElement("input");
    input.type = "text";
    input.value = subtaskText;
    input.classList.add("edit-input");
  
    // Ersetze den Text der Subtask mit dem Eingabefeld
    let listItem = document.querySelectorAll(".subtask-list-element")[index];
    let span = listItem.querySelector("span");
    listItem.replaceChild(input, span);
  
    // Event Listener zum Speichern der Änderungen
    input.addEventListener("blur", () => saveEditedSubtask(index, input.value));
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        saveEditedSubtask(index, input.value);
      }
    });
  }
  
  function saveEditedSubtask(index, newText) {
    if (newText.trim()) {
      let subtaskObj = subtasks[index];
      let oldText = Object.keys(subtaskObj)[0];
      let status = subtaskObj[oldText];
  
      // Aktualisiere das Subtask-Array mit dem neuen Text
      subtasks[index] = { [newText]: status };
      renderSubtasks();  // Render die Liste neu
    }
  }

  function deleteSubtask(index) {
    subtasks.splice(index, 1);  // Entferne die Subtask aus dem Array
    renderSubtasks();  // Render die Liste neu
  }

  function inSubtaskListButton(type) {
    return `
      <button class="${type}-subtask-button in-line-btn" type="button">
        <img src="../img/add-task/${type}.png"/>
      </button>
    `;
  }
  