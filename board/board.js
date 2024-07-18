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
  'title': 'Putzen',
  'category': 'open'
}, {
  'id': 1,
  'title': 'Kochen',
  'category': 'closed'
}];

let currentDraggedElement;

function updateHTML() {
  const categories = ['open', 'closed', 'in-progress', 'done'];
  
  categories.forEach(category => {
      let elements = todos.filter(t => t['category'] == category);
      document.getElementById(category).innerHTML = '';
      for (let index = 0; index < elements.length; index++) {
          const element = elements[index];
          document.getElementById(category).innerHTML += generateTodoHTML(element);
      }
  });
  includeHTML();
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTodoHTML(element) {
  return `
    <div onclick="openUserStory('${element.id}')" class="todo-card" draggable="true" ondragstart="startDragging(${element['id']})" ${element['title']}">
        <h3 class="tasks-cards-headline">${element.title}</h3>
    </div>
    `;   
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]['category'] = category;
  updateHTML();
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

