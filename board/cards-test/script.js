'use strict';


const PATH_TO_CONTACTS = 'contacts';
const PATH_TO_TASKS = 'tasks';


function init() {
	sessionStoreContacts();
	sessionStoreTasks();
	renderCards();
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


function formatDate(dateString) {
	let dateStr = `${dateString}`;
	let date = new Date(dateStr);
	let options = {year: 'numeric', month:'2-digit', day:'2-digit'};
	return date.toLocaleDateString('de-DE', options);
}


function createCardContainer(key, taskCardsContainer) {
	let cardDiv = document.createElement('div');
	cardDiv.id = `${key}`;
	cardDiv.className = 'todo-card';
	cardDiv.draggable = 'true';
//	cardDiv.ondragstart = startDragging(`${key}`);
//	cardDiv.onclick = openTask(`${key}`);
	taskCardsContainer.appendChild(cardDiv);
}


function createUnderContainer(key) {
	let cardDiv = document.getElementById(`${key}`);
	let underDiv = document.createElement('div');
	underDiv.id = `${key}-under-container`;
	underDiv.className = 'under-container';
	cardDiv.appendChild(underDiv);
}


function createCategoryTag(key, task) {
	let underDiv = document.getElementById(`${key}-under-container`);
	let tagContainer = document.createElement('div');
	tagContainer.id = `${key}-tag-container`;
	if(task['category'] === 'Technical Task') {
		tagContainer.className = 'technical-cards-headline-container';
	} else if(task['category'] === 'User Story') {
		tagContainer.className = 'user-cards-headline-container';
	}
	underDiv.appendChild(tagContainer);
}


function createTagSpan(key, task) {
	let tagContainer = document.getElementById(`${key}-tag-container`);
	let tagSpan = document.createElement('span');
	tagSpan.id = `${key}-span`;
	tagSpan.className = 'cards-headline';
	tagSpan.textContent = `${task['category']}`
	tagContainer.appendChild(tagSpan);
}


function createTitle(key, task) {
	let underDiv = document.getElementById(`${key}-under-container`);
	let titleTag = document.createElement('h1');
	titleTag.id = `${key}-title`;
	titleTag.className = 'cards-title';
	titleTag.textContent = `${task['title']}`
	underDiv.appendChild(titleTag);
}


function createDescription(key, task) {
	let underDiv = document.getElementById(`${key}-under-container`);
	let descriptionTag = document.createElement('span');
	descriptionTag.id = `${key}-description`;
	descriptionTag.className = 'cards-description';
	descriptionTag.textContent = `${task['description']}`
	underDiv.appendChild(descriptionTag);
}


function createCard(key, taskCardsContainer, tasks) {
	createCardContainer(key, taskCardsContainer);
	createUnderContainer(key);
	createCategoryTag(key, tasks);
	createTagSpan(key, tasks);
	createTitle(key, tasks);
	createDescription(key, tasks);
}


function renderCards() {
	let tasks = JSON.parse(sessionStorage.getItem('tasks'));
	let taskCardsContainer = document.getElementById('open');
	taskCardsContainer.innerHTML = '';
	Object.keys(tasks).forEach(key => {
		createCard(key, taskCardsContainer, tasks[`${key}`]);
	});
}


//function iterateOverJsonKeys(parentKey, jsonObject) {
//	let orderedList = document.getElementById(`${parentKey}`);
//	Object.keys(jsonObject).forEach(key => {
//		let listItem = document.createElement('li');
//		listItem.id = `${parentKey}-${key}`;
//		if(key == 'assignment') {
//			let assignedContacts = getContact(jsonObject[key]);
//			listItem.textContent = `${key}: ${assignedContacts}`;
//			orderedList.appendChild(listItem);
//		} else if(key == 'date') {
//			let dateString = formatDate(jsonObject[key]);
//			listItem.textContent = `${key}: ${dateString}`;
//			orderedList.appendChild(listItem);
//		} else {
//			listItem.textContent = `${key}: ${jsonObject[key]}`;
//			orderedList.appendChild(listItem);
//		}
//	});
//}
//
//
//function renderTasks() {
//	let tasks = JSON.parse(sessionStorage.getItem('tasks'));
//	let taskCardsContainer = document.getElementById('task-cards-container');
//	taskCardsContainer.innerHTML = '';
//	Object.keys(tasks).forEach(key => {
//		let orderedList = document.createElement('ol');
//		orderedList.id = `${key}`;
//		taskCardsContainer.appendChild(orderedList);
//		iterateOverJsonKeys(key, tasks[key]);
//	});
//}
