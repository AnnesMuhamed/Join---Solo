let subtasks = '';

document.addEventListener('DOMContentLoaded', function() {
	setupEventListeners();
});


function setupEventListeners() {
	let subTaskButton = document.getElementById('add-subtask-button');
	let subtasksList = document.getElementById('subtask-list');

	//Event listener for specific elements
	subTaskButton.addEventListener('click', confirmOrCancelSubtask);
	subtasksList.addEventListener('dblclick', handleDoubleClick);

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
		node.addEventListener('click', confirmOrCancelSubtask);
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

function confirmOrCancelSubtask() {
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
	unsortedList.innerHTML += `<li class="subtask-list-element"><span>${subtask}</span></li>`;
	clearSubtaskInput();
}

function addSubtask(subtask) {
	if(subtasks.length > 0) {
		subtasks += `,${subtask}`;
	} else {
		subtasks += subtask;
	}
}


function createInputElement(value) {
	const input = document.createElement('input');
	input.type = 'text';
	input.style = 'box-sizing: border-box; width: 100%; padding: 6px 16px;'
	input.value = value;
	return input;
}


function attachInputEventListeners(input, li, span) {
	input.addEventListener('blur', () => handleInputBlur(input, li, span));
	input.addEventListener('keypress', (event) => handleInputKeyPress(event, input));
}


function handleInputBlur(input, li, span) {
	span.textContent = input.value;
	input.remove();
	li.classList.remove('hidden');
	li.classList.add('subtask-list-element');
	li.appendChild(span);
}


function handleInputKeyPress(event, input) {
	if(event.key === 'Enter') {
		input.blur();
	}
}


function replaceLiWithInput(li, input) {
	li.classList.add('hidden');
	const inputLi = document.createElement('li');
	inputLi.appendChild(input);
	li.parentNode.insertBefore(inputLi, li);
	input.focus;
}


function handleDoubleClick(event) {
	if(event.target.tagName === 'SPAN') {
		const li = event.target.parentElement;
		const span = event.target;
		const input = createInputElement(span.textContent);
		attachInputEventListeners(input, li, span);
		replaceLiWithInput(li, input);
	}
}


