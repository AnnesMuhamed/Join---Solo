'use strict';
let pathTasks = 'tasks';
let pathContacts = 'contacts';


let expanded = false;
let contacts = null;


let priority = null;
let subtasks = [];
let assignedContacts = '';


document.addEventListener('DOMContentLoaded', function() {
	initFunc();
	setupEventListeners();
	radioButtonsSelectState();
});


async function initFunc() {
	await loadContacts();
	renderCheckboxes();
}


function setupEventListeners() {
	let searchInput = document.getElementById('search');
	let subTaskButton = document.getElementById('add-subtask-button');
	let subtasksList = document.getElementById('subtask-list');
	let clearButton = document.getElementById('clear-btn');

	//Event delegation for body-click
	document.body.addEventListener('click', handleBodyClicks);

	//Event listener for specific elements
	subTaskButton.addEventListener('click', confirmOrCancelSubtask);
	subtasksList.addEventListener('dblclick', subtasksHandleDoubleClick);
	subtasksList.addEventListener('click', subtasksHandleEditClick);
	subtasksList.addEventListener('click', subtasksHandleDeleteClick);
	subtasksList.addEventListener('mouseenter', showHideSubtaskLiButtonsContainer, true);
	subtasksList.addEventListener('mouseleave', showHideSubtaskLiButtonsContainer, true);
	searchInput.addEventListener('keyup', renderCheckboxes);
	clearButton.addEventListener('click', clearForm);

	subtasksMutationObserver();

	//Event listener for submit
	document.body.addEventListener('submit', createTask);
}


function handleBodyClicks(event) {
	showCheckboxes(event);
	collapseCheckboxes(event);
	assignContacts(event);
}


function subtasksMutationObserver() {
	let targetNode = document.getElementById('subtask-buttons-container');
	const config = {childList: true};
	const callback = function(mutationsList) {
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


async function loadContacts() {
	contacts = await loadData(pathContacts);
}


function getContactsIds() {
	let contactsIds = [];
	for(let id in contacts) {
		contactsIds.push(id);
	}
	return contactsIds;
}


function getContactInitials(id) {
	return `${contacts[id]['firstName'].charAt(0)}${contacts[id]['lastName'].charAt(0)}`;
}


function assignContacts(event) {
	let assignments = document.getElementById('assigned-contacts');
	if(event.target.type === 'checkbox') {
		let checkboxId = event.target.id;
		let initials = getContactInitials(checkboxId);
		let initialsElement = document.getElementById(`${checkboxId}-${initials}`);
		if(initialsElement) {
			initialsElement.remove();
			removeContacts(checkboxId);
		} else {
			assignments.innerHTML += `
				<span class="initials-span" id="${checkboxId}-${initials}">${initials}</span>
		`;
			addContacts(checkboxId);
		}
	}
}


function filterCheckboxes(id) {
	let filter = document.getElementById('search');
	let inputValue = filter.value.toLowerCase();
	let fullName = `${contacts[id].firstName.toLowerCase()} ${contacts[id].lastName.toLowerCase()}`;
	return (fullName.includes(inputValue));
}


function checkboxState(id, initials) {
	let assignedContact = document.getElementById(`${id}-${initials}`);
	if(assignedContact) {
		let checkbox = document.getElementById(`${id}`);
		checkbox.setAttribute('checked', 'checked');
	}
}


function renderCheckboxes() {
	let contactsIds = getContactsIds();
	let checkboxes = document.getElementById('checkboxes');
	checkboxes.innerHTML = '';
	for(let n = 0; n < contactsIds.length; n++) {
		let id = contactsIds[n];
		let initials = getContactInitials(id);
		if(!(filterCheckboxes(id))) {
			continue;
		}
		checkboxes.innerHTML += `
			<label for="${id}">
				<span class="initials-span">${initials}</span>
				<span>${contacts[id]['firstName']} ${contacts[id]['lastName']}</span>
				<input type="checkbox" id="${id}">
			</label>
		`;
		checkboxState(id, initials);
	}
}


function showCheckboxes(event) {
	let checkboxes = document.getElementById('checkboxes');
	if(event.target.closest('.select-box')) {
		if (!expanded) {
			checkboxes.style.display = 'block';
			expanded = true;
		} else {
			checkboxes.style.display = 'none';
			expanded = false;
		}
	}
}


function collapseCheckboxes(event) {
	let checkboxes = document.getElementById('checkboxes');
	let search = document.getElementById('search');
	if(!event.target.closest('.assignment-container')) {
		search.value = '';
		checkboxes.style.display = 'none';
		expanded = false;
	}
}


function radioButtonsSelectState() {
	const radioButtons = document.querySelectorAll('input[type="radio"]');
	let lastChecked = null;
	radioButtons.forEach(radio => {
		radio.addEventListener('click', function() {
			if(this === lastChecked) {
				this.checked = false;
				resetRadioImg(this);
				lastChecked = null;
				priority = null;
			} else {
				if(lastChecked != this) {
					radioButtons.forEach(radio => {
						resetRadioImg(radio);
					});
				}
				changeRadioImg(this);
				getPriority(this.id);
				lastChecked = this;
			}
		});
	});
}


function changeRadioImg(radio) {
	let img = radio.nextElementSibling.querySelector('img');
	if(radio.value === '3') {
		img.src = '../img/add-task/prio-high-selected.png';
	} else if(radio.value === '2') {
		img.src = '../img/add-task/prio-med-selected.png';
	} else if(radio.value === '1') {
		img.src = '../img/add-task/prio-low-selected.png';
	}
}


function resetRadioImg(radio) {
	let img = radio.nextElementSibling.querySelector('img');
	if(radio.value === '3') {
		img.src = '../img/add-task/prio-high.png';
	} else if(radio.value === '2') {
		img.src = '../img/add-task/prio-med.png';
	} else if(radio.value === '1') {
		img.src = '../img/add-task/prio-low.png';
	}
}


function getTitle() {
	let title = document.getElementById('title');
	return title.value;
}


function getDescription() {
	let description = document.getElementById('description');
	return description.value;
}


function getDate() {
	let date = document.getElementById('date');
	return date.value;
}


function getCategory() {
	let category = document.getElementById('category');
	return category.value;
}


function getSubtask() {
	let subtask = document.getElementById('subtasks');
	return subtask.value;
}


function addContacts(contactId) {
	if(assignedContacts.length > 0) {
		assignedContacts += `,${contactId}`;
	} else {
		assignedContacts += contactId;
	}
}


function removeContacts(contactId) {
	let partedIds = assignedContacts.split(',');
	let idx = partedIds.indexOf(contactId);
	if(idx !== -1) {
		partedIds.splice(idx, 1);
	}
	assignedContacts = partedIds.join(',');
}


function inlineSubtaskButton(type) {
	return (`
		<button id="${type}-subtask-button" class="in-line-btn" type="button">
			<img src="../img/add-task/${type}.png"/>
		</button>
	`);
}


function inSubtaskListButton(type) {
	return (`
		<button class="${type}-subtask-button in-line-btn" type="button">
			<img src="../img/add-task/${type}.png"/>
		</button>
	`);
}


function verticalSeparator(width, height, stroke) {
	return (`
		<svg width="${width}" height="${height}">
			<line x1="0" y1="0" x2="0" y2="${height}" stroke="${stroke}" stroke-width="1"/>
		</svg>
	`);
}


function clearSubtaskInput() {
	let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
	let subtask = document.getElementById('subtasks');
	subtask.value = '';
	subtaskButtonContainer.innerHTML = '';
	subtaskButtonContainer.innerHTML = `
		${inlineSubtaskButton('add')}
	`;
}


function confirmOrCancelSubtask() {
	let subtaskButtonContainer = document.getElementById('subtask-buttons-container');
	let subtask = document.getElementById('subtasks');
	if(subtask.value) {
		subtaskButtonContainer.innerHTML = '';
		subtaskButtonContainer.innerHTML = `
			${inlineSubtaskButton('clear')}
			${verticalSeparator('1px', '24px', '#D1D1D1')}
			${inlineSubtaskButton('check')}
	`;
	}
}


function renderSubtask() {
	let unsortedList = document.getElementById('subtask-list');
	let subtask = getSubtask();
	addSubtask(subtask);
	let newListElement = document.createElement('li');
	newListElement.id = subtask;
	newListElement.classList.add('subtask-list-element');
	newListElement.innerHTML += `
								<span>${subtask}</span>
								<div class="subtaskli-buttons-container hidden">
									${inSubtaskListButton('edit')}
									${verticalSeparator('1px', '24px', '#A8A8A8')}
									${inSubtaskListButton('delete')}
								</div>
							`;
	unsortedList.appendChild(newListElement);
	clearSubtaskInput();
}


function showHideSubtaskLiButtonsContainer(event) {
	let targetElement = event.target.closest('.subtask-list-element');
	if(targetElement) {
		let container = targetElement.querySelector('.subtaskli-buttons-container');
		if(container) {
			if(event.type === 'mouseenter') {
				container.classList.remove('hidden');
			} else if(event.type === 'mouseleave') {
				container.classList.add('hidden');
			}
		}
	}
}


function addSubtask(subtask) {
    subtasks.push({[subtask]: 'open'});
}


function findValueByKey(array, key) {
    for(let obj of array) {
        if(obj.hasOwnProperty(key)) {
            return obj[key];
        }
    }
    return null;
}


function editSubtasks() {
	let listedSubtasks = document.querySelectorAll('li.subtask-list-element');
	if(!listedSubtasks) {
		subtasks = [];
	} else {
        let subtasksArray = Array.from(listedSubtasks).map(element => {
            return element.querySelector('span').textContent;
        });
        let existingKeys = subtasks.map(obj => Object.keys(obj)[0]);
        let keyToRemove = existingKeys.find(key => !subtasksArray.includes(key));
        let keyToAdd = subtasksArray.find(key => !existingKeys.includes(key));
        if(keyToAdd && keyToRemove) {
            let value = findValueByKey(subtasks, keyToRemove);
            subtasks.push({[keyToAdd]: value});
            subtasks = subtasks.filter(obj => !obj.hasOwnProperty(keyToRemove));
        } else if(!keyToAdd && keyToRemove) {
            subtasks = subtasks.filter(obj => !obj.hasOwnProperty(keyToRemove));
        }
	}
	removeEmptyListElements();
}


function removeEmptyListElements() {
	let listElements = document.querySelectorAll('LI');
	listElements.forEach((element) => {
		if(element.innerHTML === '') {
			element.remove();
		}
	});
}


function createInputElement(value) {
	const input = document.createElement('input');
	input.type = 'text';
	input.style = 'box-sizing: border-box; width: 100%; padding: 6px 16px;'
	input.value = value;
	return input;
}


function attachInputEventListeners(input, li, span, buttonsContainer) {
	input.addEventListener('blur', () => handleInputBlur(input, li, span, buttonsContainer));
	input.addEventListener('keypress', (event) => handleInputKeyPress(event, input));
}


function handleInputKeyPress(event, input) {
	if(event.key === 'Enter') {
		input.blur();
	}
}


function handleInputBlur(input, li, span, buttonsContainer) {
	span.textContent = input.value;
	input.remove();
	li.classList.remove('hidden');
	li.classList.add('subtask-list-element');
	li.id = span.textContent;
	li.appendChild(span);
	li.appendChild(buttonsContainer);
	editSubtasks();
}


function replaceLiWithInput(li, input) {
	li.classList.add('hidden');
	const inputLi = document.createElement('li');
	inputLi.appendChild(input);
	li.parentNode.insertBefore(inputLi, li);
	input.focus;
}


function subtasksHandleDoubleClick(event) {
	if(event.target.tagName === 'SPAN') {
		const li = event.target.parentElement;
		const span = event.target;
		const buttonsContainer = li.querySelector('.subtaskli-buttons-container');
		const input = createInputElement(span.textContent);
		replaceLiWithInput(li, input);
		attachInputEventListeners(input, li, span, buttonsContainer);
	}
}


function subtasksHandleEditClick(event) {
	if(event.target.closest('.edit-subtask-button')) {
		const li = event.target.closest('li');
		const span = li.querySelector('span');
		const buttonsContainer = li.querySelector('.subtaskli-buttons-container');
		const input = createInputElement(span.textContent);
		replaceLiWithInput(li, input);
		attachInputEventListeners(input, li, span, buttonsContainer);
	}
}


function subtasksHandleDeleteClick(event) {
	if(event.target.closest('.delete-subtask-button')) {
		const li = event.target.closest('li');
		li.remove();
		editSubtasks();
	}
}


function getPriority(id) {
	let radioButton = document.getElementById(`${id}`);
	priority = radioButton.value;
}


function createTaskJson() {
	let task = {
		'title': getTitle(),
		'description': getDescription(),
		'assignment': assignedContacts,
		'date': getDate(),
		'priority': priority,
		'category': getCategory(),
		'subtasks': JSON.stringify(subtasks),
		'state': 'open',
	};
	return task;
}


async function createTask(event) {
	event.preventDefault();
	let task = createTaskJson();
	try {
		let json = await postData(pathTasks, task);
		event.target.submit();
	} catch (error) {
		console.error('Error while sending data:', error);
	}
}


function clearInputElements() {
	let elements = document.querySelectorAll('input:not([type="radio"]), textarea');
	elements.forEach(element => {
		element.value = '';
	});
}


function clearSelectElements() {
	let elements = document.querySelectorAll('select[type="text"]');
	elements.forEach(element => {
		element.selectedIndex = 0;
		element.classList.remove('invalid');
	});
}


function clearRadioButtons() {
	let radios = document.querySelectorAll('input[type="radio"]');
	radios.forEach(radio => {
		radio.checked = false;
	});
	priority = null;
}


function clearCheckboxes() {
	let checkboxes = document.querySelectorAll('input[type="checkbox"]');
	checkboxes.forEach(checkbox => {
		checkbox.checked = false;
	});
	assignedContacts = '';
}


function clearDivs() {
	let divs = document.querySelectorAll('#assigned-contacts, #subtask-list');
	divs.forEach(div => {
		div.innerHTML = '';
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
