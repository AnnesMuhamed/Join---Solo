let subtasks = {};  // Speichert Subtasks basierend auf dem suffix

function subtasksMutationObserver(suffix = '1') {
    let targetNode = document.getElementById("subtask-buttons-container" + suffix);
  
    // Prüfe, ob das Element existiert, bevor der Observer angewendet wird
    if (targetNode) {
      const config = { childList: true };
      const callback = function (mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              attachEventListener(node, suffix);
            });
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    } else {
      console.error(`Element "subtask-buttons-container${suffix}" not found.`);
    }
  }
  
  

// Funktion zum Abrufen der Subtask aus dem Input-Feld
function getSubtask(suffix = '1') {
  let subtask = document.getElementById("subtasks" + suffix);
  return subtask.value;
}

// Inline-Button für Subtasks (Add, Edit, Delete, etc.)
function inlineSubtaskButton(type, suffix = '1') {
  return `
    <button id="${type}-subtask-button${suffix}" class="in-line-btn" type="button">
      <img src="../img/add-task/${type}.png"/>
    </button>
  `;
}

// Buttons in der Subtask-Liste (Edit, Delete)
function inSubtaskListButton(type, suffix = '1') {
  return `
    <button class="${type}-subtask-button in-line-btn" type="button">
      <img src="../img/add-task/${type}.png"/>
    </button>
  `;
}

// Funktion zum Zurücksetzen des Subtask-Input-Feldes und der Buttons
function clearSubtaskInput(suffix = '1') {
  let subtaskButtonContainer = document.getElementById("subtask-buttons-container" + suffix);
  let subtask = document.getElementById("subtasks" + suffix);
  subtask.value = "";
  subtaskButtonContainer.innerHTML = "";
  subtaskButtonContainer.innerHTML = `
    ${inlineSubtaskButton("add", suffix)}
  `;
}

function confirmOrCancelSubtask(suffix = '1') {
    let subtaskButtonContainer = document.getElementById("subtask-buttons-container" + suffix);
    let subtask = document.getElementById("subtasks" + suffix);
  
    // Prüfe, ob das Input-Feld existiert
    if (subtask) {
      if (subtask.value) {
        subtaskButtonContainer.innerHTML = `
          ${inlineSubtaskButton("clear", suffix)}
          ${verticalSeparator("1px", "24px", "#D1D1D1")}
          ${inlineSubtaskButton("check", suffix)}
        `;
      }
    } else {
      console.error(`Subtask input "subtasks${suffix}" not found.`);
    }
  }
  

  function renderSubtask(suffix = '1') {
    let unsortedList = document.getElementById("subtask-list" + suffix);
    let subtask = getSubtask(suffix);
    addSubtask(subtask, suffix);
    let newListElement = document.createElement("li");
    newListElement.id = subtask;
    newListElement.classList.add("subtask-list-element");
    newListElement.innerHTML = `
      <span>${subtask}</span>
      <div class="subtaskli-buttons-container">
        <button class="edit-subtask-button in-line-btn" type="button" onclick="editSubtask('${suffix}', '${subtask}')">
          <img src="../img/add-task/edit.png" />
        </button>
        <svg height="24px" width="1px">
          <line x1="0" y1="0" x2="0" y2="24px" style="stroke:#A8A8A8;stroke-width:1px"></line>
        </svg>
        <button class="delete-subtask-button in-line-btn" type="button" onclick="deleteSubtask('${suffix}', '${subtask}')">
          <img src="../img/add-task/delete.png" />
        </button>
      </div>
    `;
    unsortedList.appendChild(newListElement);
    clearSubtaskInput(suffix);
  }
  
  

// Funktion zum Anzeigen/Verstecken der Subtask-Buttons
function showHideSubtaskLiButtonsContainer(event) {
  let targetElement = event.target.closest(".subtask-list-element");
  if (targetElement) {
    let container = targetElement.querySelector(".subtaskli-buttons-container");
    if (container) {
      if (event.type === "mouseenter") {
        container.classList.remove("hidden");
      } else if (event.type === "mouseleave") {
        container.classList.add("hidden");
      }
    }
  }
}

// Subtask hinzufügen
function addSubtask(subtask, suffix = '1') {
  if (!subtasks[suffix]) subtasks[suffix] = [];
  subtasks[suffix].push({ [subtask]: "open" });
}

// Subtasks bearbeiten
function editSubtasks(suffix = '1') {
  let listedSubtasks = document.querySelectorAll("li.subtask-list-element");
  if (!listedSubtasks) {
    subtasks[suffix] = [];
  } else {
    let subtasksArray = Array.from(listedSubtasks).map((element) => {
      return element.querySelector("span").textContent;
    });
    let existingKeys = subtasks[suffix].map((obj) => Object.keys(obj)[0]);
    let keyToRemove = existingKeys.find((key) => !subtasksArray.includes(key));
    let keyToAdd = subtasksArray.find((key) => !existingKeys.includes(key));
    if (keyToAdd && keyToRemove) {
      let value = findValueByKey(subtasks[suffix], keyToRemove);
      subtasks[suffix].push({ [keyToAdd]: value });
      subtasks[suffix] = subtasks[suffix].filter((obj) => !obj.hasOwnProperty(keyToRemove));
    } else if (!keyToAdd && keyToRemove) {
      subtasks[suffix] = subtasks[suffix].filter((obj) => !obj.hasOwnProperty(keyToRemove));
    }
  }
  removeEmptyListElements(suffix);
}

// Leere Listenelemente entfernen
function removeEmptyListElements(suffix = '1') {
  let listElements = document.querySelectorAll("LI");
  listElements.forEach((element) => {
    if (element.innerHTML === "") {
      element.remove();
    }
  });
}

// Hilfsfunktion: Eingabefeld erstellen
function createInputElement(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.style = "box-sizing: border-box; width: 100%; padding: 6px 16px;";
  input.value = value;
  return input;
}

// Textfeld bei Bearbeitung ersetzen
function replaceLiWithInput(li, input) {
  li.classList.add("hidden");
  const inputLi = document.createElement("li");
  inputLi.appendChild(input);
  li.parentNode.insertBefore(inputLi, li);
  input.focus();
}

// Doppelklick zum Bearbeiten der Subtask
function subtasksHandleDoubleClick(event, suffix = '1') {
  if (event.target.tagName === "SPAN") {
    const li = event.target.parentElement;
    const span = event.target;
    const buttonsContainer = li.querySelector(".subtaskli-buttons-container");
    const input = createInputElement(span.textContent);
    replaceLiWithInput(li, input);
    attachInputEventListeners(input, li, span, buttonsContainer, suffix);
  }
}

// Event-Handler für das Bearbeiten
function subtasksHandleEditClick(event, suffix = '1') {
  if (event.target.closest(".edit-subtask-button")) {
    const li = event.target.closest("li");
    const span = li.querySelector("span");
    const buttonsContainer = li.querySelector(".subtaskli-buttons-container");
    const input = createInputElement(span.textContent);
    replaceLiWithInput(li, input);
    attachInputEventListeners(input, li, span, buttonsContainer, suffix);
  }
}

// Event-Handler für das Löschen
function subtasksHandleDeleteClick(event, suffix = '1') {
  if (event.target.closest(".delete-subtask-button")) {
    const li = event.target.closest("li");
    li.remove();
    editSubtasks(suffix);
  }
}

// Event Listener für die Eingabe
function attachInputEventListeners(input, li, span, buttonsContainer, suffix = '1') {
  input.addEventListener("blur", () =>
    handleInputBlur(input, li, span, buttonsContainer, suffix)
  );
  input.addEventListener("keypress", (event) =>
    handleInputKeyPress(event, input)
  );
}

// Bei Tastendruck Enter das Subtask-Eingabefeld schließen
function handleInputKeyPress(event, input) {
  if (event.key === "Enter") {
    input.blur();
  }
}

// Subtask-Textfeld aktualisieren, wenn Bearbeitung abgeschlossen ist
function handleInputBlur(input, li, span, buttonsContainer, suffix = '1') {
  span.textContent = input.value;
  input.remove();
  li.classList.remove("hidden");
  li.classList.add("subtask-list-element");
  li.id = span.textContent;
  li.appendChild(span);
  li.appendChild(buttonsContainer);
  editSubtasks(suffix);
}

// Vertikaler Separator für Buttons
function verticalSeparator(width, height, color) {
  return `
    <svg height="${height}" width="${width}">
      <line x1="0" y1="0" x2="0" y2="${height}" style="stroke:${color};stroke-width:${width}" />
    </svg>
  `;
}
