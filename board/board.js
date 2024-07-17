'use strict';
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

let todos = [{
  'id': 0,
  'title': 'User Story',
  'category': 'open'
}, {
  'id': 1,
  'title': 'Technical Task',
  'category': 'open'
}, {
  'id': 2,
  'title': 'Technical Task',
  'category': 'closed'
}];

let currentDraggedElement;

function updateHTML() {
  const categories = ['to-do', 'in-progress', 'await-feedback', 'done'];

  categories.forEach(category => {
    let tasks = todos.filter(t => t['category'] === category);
    document.getElementById(category).innerHTML = '';

    for (let index = 0; index < tasks.length; index++) {
      const element = tasks[index];
      document.getElementById(category).innerHTML += generateTodoHTML(element);
    }
  });

  includeHTML();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function highlight(category) {
  document.getElementById(category).classList.add('highlight');
}

function removeHighlight(category) {
  document.getElementById(category).classList.remove('highlight');
}

function moveTo(ev, category) {
  ev.preventDefault();
  const todoId = ev.dataTransfer.getData("text");
  const todoIndex = todos.findIndex(t => t.id == todoId);
  if (todoIndex > -1) {
    todos[todoIndex].category = category;
    updateHTML();
  }
}

function generateTodoHTML(todo) {
  return `
    <div onclick="openUserStory('${todo.id}')" class="todo-card" draggable="true" ondragstart="drag(event)" id="${todo.id}">
        <h3 class="tasks-cards-headline">${todo.title}</h3>
    </div>
    `;   
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function openAddTaskForm() {
  openForm('newTask');
}

function openForm(formId) {
  document.getElementById(formId).classList.add('show');
  document.getElementById('overlay').style.display = 'block';
  document.body.classList.add('modal-open');
}

function closeAddTaskForm() {
  closeForm('newTask');
}

function closeForm(formId) {
  document.getElementById(formId).classList.remove('show');
  document.getElementById('overlay').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function openUserStory() {
    document.getElementById('userStoryCard').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('modal-open');
  
}

function closeUserStory() {
  document.getElementById('userStoryCard').classList.remove('show');
  document.getElementById('overlay').style.display = 'none';
  document.body.classList.remove('modal-open');
}

function initialize() {
  includeHTML();
  updateHTML();
}

document.addEventListener("DOMContentLoaded", updateHTML);

