'use strict';
let pathTasks = 'tasks';
let pathContacts = 'contacts';


let expanded = false;
let contacts = null;


let priority = null;
let subtasks = '';
let assignedContacts = '';


document.addEventListener('DOMContentLoaded', function() {
	initFunc();
	setupEventListeners();
	radioButtonsSelectState();
});


function setupEventListeners() {
	let searchInput = document.getElementById('search');
	let subTaskButton = document.getElementById('add-subtask-button');
	let clearButton = document.getElementById('clear-btn');

	//Event delegation for body-click
	document.body.addEventListener('click', handleBodyClicks);

	//Event listener for specific elements
	subTaskButton.addEventListener('click', renderSubtask);
	searchInput.addEventListener('keyup', renderCheckboxes);
	clearButton.addEventListener('click', clearForm);

	//Event listener for submit
	document.body.addEventListener('submit', createTask);
}


function handleBodyClicks(event) {
	showCheckboxes(event);
	collapseCheckboxes(event);
	assignContacts(event);
}


async function initFunc() {
	await loadContacts();
	includeHTML();
	renderCheckboxes();
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
				lastChecked = null;
				priority = null;
			} else {
				getPriority(this.id);
				lastChecked = this;
			}
		});
	});
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


function addSubtask(subtask) {
	if(subtasks.length > 0) {
		subtasks += `,${subtask}`;
	} else {
		subtasks += subtask;
	}
}

function renderSubtask() {
	let unsortedList = document.getElementById('subtask-list');
	let subtask = getSubtask();
	addSubtask(subtask);
	unsortedList.innerHTML += `<li>${subtask}</li>`;
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
		'subtasks': subtasks,
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
	subtasks = '';
}


function clearForm() {
	clearInputElements();
	clearSelectElements();
	clearRadioButtons();
	clearCheckboxes();
	clearDivs();
}


async function loadData(path='') {
	let response = await fetch(`${BASE_URL}${path}.json`);
	let responseToJson = await response.json();
	return responseToJson;
}


async function postData(path="", data={}) {
	let response = await fetch(BASE_URL + path + ".json",{
		method: "POST",
		header: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data)
	});
	let responseToJson = await response.json();
	return responseToJson;
}


