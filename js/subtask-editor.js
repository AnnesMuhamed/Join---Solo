let subtasks = [];

function getSubtask() {
  let subtask = document.getElementById("subtasks");
  return subtask.value;
}

function clearSubtaskInput(idSuffix) {
  const subtaskButtonContainer = document.getElementById(`subtask-buttons-container${idSuffix}`);
  const subtaskInput = document.getElementById(`subtask-input${idSuffix}`);

  if (!subtaskInput || !subtaskButtonContainer) {
    console.error("Das Element 'subtask-input' oder 'subtask-buttons-container' wurde nicht gefunden.");
    return;
  }

  subtaskInput.value = "";
  subtaskButtonContainer.innerHTML = generateClearSubtaskButtonTemplate(idSuffix);
}

function confirmOrCancelSubtask() {
  const subtaskButtonContainer = document.getElementById("subtask-buttons-container");
  const subtaskInput = document.getElementById("subtasks");

  if (!subtaskInput || !subtaskButtonContainer) {
    console.error("Das Element 'subtasks' oder 'subtask-buttons-container' wurde nicht gefunden.");
    return;
  }

  if (subtaskInput.value.trim() !== "") {
    subtaskButtonContainer.innerHTML = generateConfirmOrCancelSubtaskTemplate();
  }
}

function renderSubtask() {
  const unsortedList = document.getElementById("subtask-list");
  const subtask = getSubtask();

  if (subtask.trim() !== "") {
    addSubtask(subtask);
    const newListElement = document.createElement("li");
    newListElement.classList.add("subtask-list-element");
    newListElement.innerHTML = generateSubtaskTemplate(subtask);
    unsortedList.appendChild(newListElement);

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
