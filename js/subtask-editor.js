let subtasks = [];

/**
 * Retrieves the value of the subtask input field.
 * 
 * @returns {string} - The value of the subtask input field.
 */
function getSubtask() {
  let subtask = document.getElementById("subtasks");
  return subtask.value;
}

/**
 * Clears the subtask input field and resets the subtask button container for a specific task.
 * 
 * @param {string} idSuffix - The suffix used to identify the specific subtask input and button container elements.
 */
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

/**
 * Confirms or cancels the creation of a subtask based on the value of the subtask input field.
 * If the input field is not empty, it generates the confirm or cancel buttons.
 */
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

/**
 * Renders a new subtask by creating a list item element and appending it to the subtask list.
 * If the subtask input is not empty, it also adds the subtask, generates its template,
 * and clears the input field after rendering.
 */
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

/**
 * Deletes a subtask from the list when the delete button is clicked.
 * It removes the corresponding list item (li) and updates the subtasks.
 * 
 * @param {HTMLElement} button - The button element that was clicked to delete the subtask.
 */
function deleteSubtask(button) {
  const li = button.closest("li");
  li.remove();
  editSubtasks();
}

/**
 * Edits a subtask by replacing the text of the subtask with an input field.
 * The input field is pre-filled with the current text of the subtask and event listeners are attached to handle changes.
 * 
 * @param {HTMLElement} button - The button element clicked to edit the subtask.
 */
function editSubtask(button) {
  const li = button.closest("li");
  const span = li.querySelector("span");
  const input = createInputElement(span.textContent);
  replaceLiWithInput(li, input);
  attachInputEventListeners(input, li, span, li.querySelector(".subtaskli-buttons-container"));
}

/**
 * Shows or hides the subtask buttons container when hovering over a subtask list item.
 * Displays the buttons container on mouse enter and hides it on mouse leave.
 * 
 * @param {Event} event - The mouse event triggered by hovering over a subtask list item.
 */
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

/**
 * Adds a new subtask to the subtasks array with a default status of "open".
 * 
 * @param {string} subtask - The text of the subtask to add to the subtasks array.
 */
function addSubtask(subtask) {
  subtasks.push({ [subtask]: "open" });
}

/**
 * Searches an array of objects for a specific key and returns its corresponding value.
 * 
 * @param {Array} array - The array of objects to search through.
 * @param {string} key - The key to search for in each object.
 * @returns {string|null} - The value associated with the key, or null if the key is not found.
 */
function findValueByKey(array, key) {
  for (let obj of array) {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
  }
  return null;
}

/**
 * Edits the list of subtasks by synchronizing the displayed subtasks with the existing subtasks array.
 * If there are changes, it updates the subtasks array by adding new ones or removing missing ones,
 * and removes any empty list elements from the UI.
 */
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

/**
 * Removes all list items (LI elements) from the DOM that are empty (i.e., have no inner HTML content).
 */
function removeEmptyListElements() {
  let listElements = document.querySelectorAll("LI");
  listElements.forEach((element) => {
    if (element.innerHTML === "") {
      element.remove();
    }
  });
}

/**
 * Creates an input element of type text with a given value and a specific class.
 * 
 * @param {string} value - The initial value to set for the input element.
 * @returns {HTMLInputElement} - The newly created input element.
 */
function createInputElement(value) {
  const input = document.createElement("input");
  input.classList.add("addTask-subtasks");  
  input.type = "text";
  input.value = value;
  return input;
}

/**
 * Attaches event listeners to the input element for handling blur and keypress events.
 * The blur event will trigger when the input field loses focus, and the keypress event will trigger on keypress.
 * 
 * @param {HTMLInputElement} input - The input element to attach the event listeners to.
 * @param {HTMLElement} li - The list item element that contains the input.
 * @param {HTMLElement} span - The span element that holds the original subtask text.
 * @param {HTMLElement} buttonsContainer - The container for the buttons associated with the subtask.
 */
function attachInputEventListeners(input, li, span, buttonsContainer) {
  input.addEventListener("blur", () =>
    handleInputBlur(input, li, span, buttonsContainer)
  );
  input.addEventListener("keypress", (event) =>
    handleInputKeyPress(event, input)
  );
}

/**
 * Handles the keypress event for the input element. If the "Enter" key is pressed, it triggers the blur event
 * to move the focus out of the input, thus committing the changes.
 * 
 * @param {Event} event - The keypress event triggered when a key is pressed.
 * @param {HTMLInputElement} input - The input element where the keypress event occurs.
 */
function handleInputKeyPress(event, input) {
  if (event.key === "Enter") {
    input.blur();
  }
}

/**
 * Handles the blur event for the input element. When the input loses focus, 
 * it updates the corresponding span with the input value, removes the input field, 
 * and restores the list item's original structure, including buttons.
 * It also triggers the editSubtasks function to ensure the subtasks array is updated.
 * 
 * @param {HTMLInputElement} input - The input element that lost focus.
 * @param {HTMLElement} li - The list item element containing the subtask.
 * @param {HTMLElement} span - The span element that holds the subtask text.
 * @param {HTMLElement} buttonsContainer - The container holding the buttons for the subtask.
 */
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

/**
 * Replaces a list item (li) with an input element by hiding the original li,
 * creating a new li containing the input, and placing it before the original li.
 * It also focuses on the input element to allow immediate editing.
 * 
 * @param {HTMLElement} li - The list item element to be replaced.
 * @param {HTMLInputElement} input - The input element to replace the list item with.
 */
function replaceLiWithInput(li, input) {
  li.classList.add("hidden");
  const inputLi = document.createElement("li");
  inputLi.appendChild(input);
  li.parentNode.insertBefore(inputLi, li);
  input.focus();
}