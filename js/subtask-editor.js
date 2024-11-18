let subtasks = [];

function getSubtask() {
  let subtask = document.getElementById("subtasks");
  return subtask.value;
}

function inlineSubtaskButton(type) {
  return `
		<button id="${type}-subtask-button" class="in-line-btn" type="button">
			<img src="../assets/img/${type}.png"/>
		</button>
	`;
}

function inSubtaskListButton(type) {
  return `
		<button class="${type}-subtask-button in-line-btn" type="button">
			<img src="../assets/img/${type}.png"/>
		</button>
	`;
}

function clearSubtaskInput() {
  const subtaskButtonContainer = document.getElementById("subtask-buttons-container");
  const subtaskInput = document.getElementById("subtasks");

  if (!subtaskInput || !subtaskButtonContainer) {
    console.error("Das Element 'subtasks' oder 'subtask-buttons-container' wurde nicht gefunden.");
    return;
  }

  // Eingabefeld leeren
  subtaskInput.value = "";

  // Buttons für neue Subtasks zurücksetzen
  subtaskButtonContainer.innerHTML = `
    <button id="add-subtask-button" class="in-line-btn" type="button" onclick="confirmOrCancelSubtask()">
      <img src="../assets/img/add.png"/>
    </button>
  `;
}

function confirmOrCancelSubtask() {
  const subtaskButtonContainer = document.getElementById("subtask-buttons-container");
  const subtaskInput = document.getElementById("subtasks");

  if (!subtaskInput || !subtaskButtonContainer) {
    console.error("Das Element 'subtasks' oder 'subtask-buttons-container' wurde nicht gefunden.");
    return;
  }

  if (subtaskInput.value.trim() !== "") {
    subtaskButtonContainer.innerHTML = `
      <button class="in-line-btn" type="button" onclick="clearSubtaskInput()">
        <img src="../assets/img/clear.png"/>
      </button>
      ${verticalSeparator("1px", "24px", "#D1D1D1")}
      <button class="in-line-btn" type="button" onclick="renderSubtask()">
        <img src="../assets/img/check.png"/>
      </button>
    `;
  }
}

function renderSubtask() {
  const unsortedList = document.getElementById("subtask-list");
  const subtask = getSubtask();

  if (subtask.trim() !== "") {
    addSubtask(subtask);

    // Neuen Listeneintrag erstellen
    const newListElement = document.createElement("li");
    newListElement.classList.add("subtask-list-element");
    newListElement.innerHTML = `
      <span>${subtask}</span>
      <div class="subtaskli-buttons-container">
        <button class="in-line-btn" type="button" onclick="editSubtask(this)">
          <img src="../assets/img/edit.png"/>
        </button>
        ${verticalSeparator("1px", "24px", "#A8A8A8")}
        <button class="in-line-btn" type="button" onclick="deleteSubtask(this)">
          <img src="../assets/img/delete.png"/>
        </button>
      </div>
    `;
    unsortedList.appendChild(newListElement);

    // Eingabefeld und Buttons zurücksetzen
    clearSubtaskInput();
  }
}

function deleteSubtask(button) {
  const li = button.closest("li");
  li.remove();
  editSubtasks();
}

function editSubtask(button) {
  const li = button.closest("li");
  const span = li.querySelector("span");
  const input = createInputElement(span.textContent);
  replaceLiWithInput(li, input);
  attachInputEventListeners(input, li, span, li.querySelector(".subtaskli-buttons-container"));
}

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

function addSubtask(subtask) {
  subtasks.push({ [subtask]: "open" });
}

function findValueByKey(array, key) {
  for (let obj of array) {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
  }
  return null;
}

function editSubtasks() {
  let listedSubtasks = document.querySelectorAll("li.subtask-list-element");
  if (!listedSubtasks) {
    subtasks = [];
  } else {
    let subtasksArray = Array.from(listedSubtasks).map((element) => {
      return element.querySelector("span").textContent;
    });
    let existingKeys = subtasks.map((obj) => Object.keys(obj)[0]);
    let keyToRemove = existingKeys.find((key) => !subtasksArray.includes(key));
    let keyToAdd = subtasksArray.find((key) => !existingKeys.includes(key));
    if (keyToAdd && keyToRemove) {
      let value = findValueByKey(subtasks, keyToRemove);
      subtasks.push({ [keyToAdd]: value });
      subtasks = subtasks.filter((obj) => !obj.hasOwnProperty(keyToRemove));
    } else if (!keyToAdd && keyToRemove) {
      subtasks = subtasks.filter((obj) => !obj.hasOwnProperty(keyToRemove));
    }
  }
  removeEmptyListElements();
}

function removeEmptyListElements() {
  let listElements = document.querySelectorAll("LI");
  listElements.forEach((element) => {
    if (element.innerHTML === "") {
      element.remove();
    }
  });
}

function createInputElement(value) {
  const input = document.createElement("input");
  input.classList.add("addTask-subtasks");  
  input.type = "text";
  input.value = value;
  return input;
}

function attachInputEventListeners(input, li, span, buttonsContainer) {
  input.addEventListener("blur", () =>
    handleInputBlur(input, li, span, buttonsContainer)
  );
  input.addEventListener("keypress", (event) =>
    handleInputKeyPress(event, input)
  );
}

function handleInputKeyPress(event, input) {
  if (event.key === "Enter") {
    input.blur();
  }
}

function handleInputBlur(input, li, span, buttonsContainer) {
  span.textContent = input.value;
  input.remove();
  li.classList.remove("hidden");
  li.classList.add("subtask-list-element");
  li.id = span.textContent;
  li.appendChild(span);
  li.appendChild(buttonsContainer);
  editSubtasks();
}

function replaceLiWithInput(li, input) {
  li.classList.add("hidden");
  const inputLi = document.createElement("li");
  inputLi.appendChild(input);
  li.parentNode.insertBefore(inputLi, li);
  input.focus();
}
