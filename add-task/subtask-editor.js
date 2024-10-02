let subtasks = [];

function subtasksMutationObserver() {
  let targetNode = document.getElementById("subtask-buttons-container");
  const config = { childList: true };
  const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          attachEventListener(node);
        });
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

function getSubtask() {
  let subtask = document.getElementById("subtasks");
  return subtask.value;
}

function inlineSubtaskButton(type) {
  return `
		<button id="${type}-subtask-button" class="in-line-btn" type="button">
			<img src="../img/add-task/${type}.png"/>
		</button>
	`;
}

function inSubtaskListButton(type) {
  return `
		<button class="${type}-subtask-button in-line-btn" type="button">
			<img src="../img/add-task/${type}.png"/>
		</button>
	`;
}

function clearSubtaskInput() {
  let subtaskButtonContainer = document.getElementById(
    "subtask-buttons-container"
  );
  let subtask = document.getElementById("subtasks");
  subtask.value = "";
  subtaskButtonContainer.innerHTML = "";
  subtaskButtonContainer.innerHTML = `
		${inlineSubtaskButton("add")}
	`;
}

function confirmOrCancelSubtask() {
  let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
  let subtask = document.getElementById('subtasks');
  if (subtask.value) {
    subtaskButtonContainer.innerHTML = '';
    subtaskButtonContainer.innerHTML = `
      ${inlineSubtaskButton("clear")}
      ${verticalSeparator("1px", "24px", "#D1D1D1")}
      ${inlineSubtaskButton("check")}
    `;
  } else {
    console.log("Subtask value is empty, not updating buttons");
  }
}


function renderSubtask() {
  console.log("renderSubtask function called");
  let unsortedList = document.getElementById("subtask-list");
  let subtask = getSubtask();
  addSubtask(subtask);
  let newListElement = document.createElement("li");
  newListElement.id = subtask;
  newListElement.classList.add("subtask-list-element");
  newListElement.innerHTML += `
								<span>${subtask}</span>
								<div class="subtaskli-buttons-container hidden">
									${inSubtaskListButton("edit")}
									${verticalSeparator("1px", "24px", "#A8A8A8")}
									${inSubtaskListButton("delete")}
								</div>
							`;
  unsortedList.appendChild(newListElement);
  clearSubtaskInput();
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
  input.type = "text";
  input.style = "box-sizing: border-box; width: 100%; padding: 6px 16px;";
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
  input.focus;
}

function subtasksHandleDoubleClick(event) {
  if (event.target.tagName === "SPAN") {
    const li = event.target.parentElement;
    const span = event.target;
    const buttonsContainer = li.querySelector(".subtaskli-buttons-container");
    const input = createInputElement(span.textContent);
    replaceLiWithInput(li, input);
    attachInputEventListeners(input, li, span, buttonsContainer);
  }
}

function subtasksHandleEditClick(event) {
  if (event.target.closest(".edit-subtask-button")) {
    const li = event.target.closest("li");
    const span = li.querySelector("span");
    const buttonsContainer = li.querySelector(".subtaskli-buttons-container");
    const input = createInputElement(span.textContent);
    replaceLiWithInput(li, input);
    attachInputEventListeners(input, li, span, buttonsContainer);
  }
}

function subtasksHandleDeleteClick(event) {
  if (event.target.closest(".delete-subtask-button")) {
    const li = event.target.closest("li");
    li.remove();
    editSubtasks();
  }
}

