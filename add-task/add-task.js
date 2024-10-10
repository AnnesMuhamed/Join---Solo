"use strict";
let pathTasks = "tasks";

function init() {
  initFunc();
  radioButtonsSelectState();
};

async function initFunc() {
  await loadContacts();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function getTitle() {
  let title = document.getElementById("title");
  return title.value;
}

function getDescription() {
  let description = document.getElementById("description");
  return description.value;
}

function getDate() {
  let date = document.getElementById("date");
  return date.value;
}

function getCategory() {
  let category = document.getElementById("category");
  return category.value;
}

function verticalSeparator(width, height, stroke) {
  return `
		<svg width="${width}" height="${height}">
			<line x1="0" y1="0" x2="0" y2="${height}" stroke="${stroke}" stroke-width="1"/>
		</svg>
	`;
}

function createTaskJson() {
  let task = {
    title: getTitle(),
    description: getDescription(),
    assignment: assignedContacts,
    date: getDate(),
    priority: priority,
    category: getCategory(),
    subtasks: JSON.stringify(subtasks),
    state: "open",
  };
  return task;
}

async function createTask(event) {
  event.preventDefault();
  let task = createTaskJson();
  try {
    let json = await postData(pathTasks, task);
    event.target.submit();
    window.open("../board/board.html");
  } catch (error) {
    console.error("Error while sending data:", error);
  }
}

function clearInputElements() {
  let elements = document.querySelectorAll(
    'input:not([type="radio"]), textarea'
  );
  elements.forEach((element) => {
    element.value = "";
  });
}

function clearSelectElements() {
  let elements = document.querySelectorAll('select[type="text"]');
  elements.forEach((element) => {
    element.selectedIndex = 0;
    element.classList.remove("invalid");
  });
}

function clearRadioButtons() {
  let radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.checked = false;
  });
  priority = null;
}

function clearCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function clearDivs() {
  let divs = document.querySelectorAll("#assigned-contacts, #subtask-list");
  divs.forEach((div) => {
    div.innerHTML = "";
  });
  subtasks = [];
}

function clearForm() {
  clearInputElements();
  clearSubtaskInput();
  clearSelectElements();
  clearRadioButtons();
  clearCheckboxes();
  clearDivs();
}

