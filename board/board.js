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
  let open = todos.filter(t => t['category'] == 'open');

  document.getElementById('open').innerHTML = '';

  for (let index = 0; index < open.length; index++) {
      const element = open[index];
      document.getElementById('open').innerHTML += generateTodoHTML(element);
  }

  let closed = todos.filter(t => t['category'] == 'closed');

  document.getElementById('closed').innerHTML = '';

  for (let index = 0; index < closed.length; index++) {
      const element = closed[index];
      document.getElementById('closed').innerHTML += generateTodoHTML(element);
  }
  includeHTML();
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTodoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]['category'] = category;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

