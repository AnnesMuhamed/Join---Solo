let subtasks = '';

document.addEventListener('DOMContentLoaded', function() {
	setupEventListeners();
});


function setupEventListeners() {
	let subTaskButton = document.getElementById('add-subtask-button');

	//Event listener for specific elements
	subTaskButton.addEventListener('click', confirmOrCancel);

	subtasksMutationObserver();
}

function subtasksMutationObserver() {
	let targetNode = document.getElementById('subtask-buttons-container');
	const config = {childList: true};
	const callback = function(mutationsList, observer) {
		for(let mutation of mutationsList) {
			if(mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					attachEventListener(node);
				});
			}
		}
	};
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}

function attachEventListener(node) {
	if(node.id === 'check-subtask-button') {
		node.addEventListener('click', renderSubtask);
	} else if (node.id === 'clear-subtask-button') {
		node.addEventListener('click', clearSubtaskInput);
	} else {
		node.addEventListener('click', confirmOrCancel);
	}
}

function inlineSubtaskButton(type) {
	return (`
		<button id="${type}-subtask-button" class="in-line-btn" type="button">
			<img src="/img/add-task/${type}.png"/>
		</button>
	`);
}

function verticalSeparator(width, height) {
	return (`
		<svg width="${width}" height="${height}">
			<line x1="0" y1="0" x2="0" y2="${height}" stroke="#D1D1D1" stroke-width="1"/>
		</svg>
	`);
}

function clearSubtaskInput() {
	let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
	let subtask = document.getElementById('subtasks');
	subtask.value = '';
	subtaskButtonContainer.innerHTML = '';
	subtaskButtonContainer.innerHTML = `
		${inlineSubtaskButton(type='add')}
	`;
}

function confirmOrCancel() {
	let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
	let subtask = document.getElementById('subtasks');
	if(subtask.value) {
		subtaskButtonContainer.innerHTML = '';
		subtaskButtonContainer.innerHTML = `
			${inlineSubtaskButton(type='clear')}
			${verticalSeparator(width='1px', height='24px')}
			${inlineSubtaskButton(type='check')}
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
	clearSubtaskInput();
}

function addSubtask(subtask) {
	if(subtasks.length > 0) {
		subtasks += `,${subtask}`;
	} else {
		subtasks += subtask;
	}
}

