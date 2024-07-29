'use strict';


const PATH_TO_CONTACTS = 'contacts';
const PATH_TO_TASKS = 'tasks';


function init() {
	sessionStoreContacts();
	sessionStoreTasks();
	renderTasks();
}


async function sessionStoreContacts() {
	let contactsJson = await loadData(PATH_TO_CONTACTS);
	sessionStorage.setItem('contacts', JSON.stringify(contactsJson));
}


async function sessionStoreTasks() {
	let tasksJson = await loadData(PATH_TO_TASKS);
	sessionStorage.setItem('tasks', JSON.stringify(tasksJson));
}


function getContact(keyedJsonObject) {
	let contacts = JSON.parse(sessionStorage.getItem('contacts'));
	let assignedContacts = keyedJsonObject.split(',');
	for(let n = 0; n < assignedContacts.length; n++) {
		let currentContact = contacts[`${assignedContacts[n]}`];
		assignedContacts[n] = `${currentContact['firstName']} ${currentContact['lastName']}`;
	}
	return assignedContacts.join(', ')
}


function iterateOverJsonKeys(parentKey, jsonObject) {
	let orderedList = document.getElementById(`${parentKey}`);
	Object.keys(jsonObject).forEach(key => {
		let listItem = document.createElement('li');
		listItem.id = `${parentKey}-${key}`;
		if(key == 'assignment') {
			let assignedContacts = getContact(jsonObject[key]);
			listItem.textContent = `${key}: ${assignedContacts}`;
			orderedList.appendChild(listItem);
		} else {
			listItem.textContent = `${key}: ${jsonObject[key]}`;
			orderedList.appendChild(listItem);
		}
	});
}


function renderTasks() {
	let tasks = JSON.parse(sessionStorage.getItem('tasks'));
	let taskCardsContainer = document.getElementById('task-cards-container');
	taskCardsContainer.innerHTML = '';
	Object.keys(tasks).forEach(key => {
		let orderedList = document.createElement('ol');
		orderedList.id = `${key}`;
		taskCardsContainer.appendChild(orderedList);
		iterateOverJsonKeys(key, tasks[key]);
	});
}
