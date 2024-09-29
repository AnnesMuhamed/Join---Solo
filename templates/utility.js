let subtaskList = [];

function addSubtask(idSuffix = '') {
  let subTaskInput = document.getElementById('subtasks' + idSuffix);
  let subTaskValue = subTaskInput.value.trim();

  if (subTaskValue !== '') {
    let subTaskListElement = document.getElementById('subtask-list' + idSuffix);
    
    let newListItem = document.createElement('li');
    newListItem.classList.add('subtask-list-element');
    newListItem.innerHTML = `
      <span>${subTaskValue}</span>
      <button onclick="removeSubtask('${subTaskValue}', '${idSuffix}')">Delete</button>
    `;

    subTaskListElement.appendChild(newListItem);
    subtaskList.push({ task: subTaskValue, done: false });

    subTaskInput.value = '';
  }
}

function removeSubtask(taskValue, idSuffix = '') {
  subtaskList = subtaskList.filter(subtask => subtask.task !== taskValue);
  let subTaskListElement = document.getElementById('subtask-list' + idSuffix);
  let subTaskItem = subTaskListElement.querySelector(`li:contains("${taskValue}")`);
  if (subTaskItem) {
    subTaskListElement.removeChild(subTaskItem);
  }
}

function renderSubtasks(idSuffix = '') {
  let subTaskListElement = document.getElementById('subtask-list' + idSuffix);
  subTaskListElement.innerHTML = ''; // Clear existing subtasks

  subtaskList.forEach(subtask => {
    let newListItem = document.createElement('li');
    newListItem.classList.add('subtask-list-element');
    newListItem.innerHTML = `
      <span>${subtask.task}</span>
      <button onclick="removeSubtask('${subtask.task}', '${idSuffix}')">Delete</button>
    `;
    subTaskListElement.appendChild(newListItem);
  });
}
