let subtasks = '';

document.addEventListener('DOMContentLoaded', function() {
	setupEventListeners();
});


function setupEventListeners() {
	let subTaskButton = document.getElementById('add-subtask-button');

	//Event listener for specific elements
	subTaskButton.addEventListener('click', confirmOrCancel);
}


function confirmOrCancel() {
	let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
	let subtask = document.getElementById('subtasks');
	if(subtask.value) {
		subtaskButtonContainer.innerHTML = '';
		subtaskButtonContainer.innerHTML = `
						<button id="cancel-subtask-button" class="in-line-btn" type="button">
							<img src="/img/add-task/clear.png"/>
						</button>
						<svg width="1px" height="24px">
							<line x1="0" y1="0" x2="0" y2="24px" stroke="#D1D1D1" stroke-width="1"/>
						</svg>
						<button id="confirm-subtask-button" class="in-line-btn" type="button">
							<img src="/img/add-task/check.png"/>
						</button>
	`;
	}
}

function getSubtask() {
	let subtask = document.getElementById('subtasks');
	return subtask.value;
}

function renderSubtask() {
	let unsortedList = document.getElementById('subtask-list');
	let subtask = getSubtask();
	addSubtask(subtask);
	unsortedList.innerHTML += `<li>${subtask}</li>`;
}

function addSubtask(subtask) {
	if(subtasks.length > 0) {
		subtasks += `,${subtask}`;
	} else {
		subtasks += subtask;
	}
}

