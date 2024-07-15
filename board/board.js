function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

let todos = [{
  'id': 0,
  'title': 'User Story',
  'category': 'to-do'
}, {
  'id': 1,
  'title': 'Technical Task',
  'category': 'in-progress'
}, {
  'id': 2,
  'title': 'Technical Task',
  'category': 'done'
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
  return `<div class="todo-card" draggable="true" ondragstart="drag(event)" id="${todo.id}">
              <h3>${todo.title}</h3>
          </div>`;
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
