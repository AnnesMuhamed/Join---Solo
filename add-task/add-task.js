'use strict';
const BASE_URL = '';
let path = '';


let priority = null;
let task = null;


document.addEventListener('DOMContentLoaded', function() {
	const radioButtons = document.querySelectorAll('input[type="radio"]');
	let lastChecked = null;

	radioButtons.forEach(radio => {
		radio.addEventListener('click', function() {
			if(this === lastChecked) {
				this.checked = false;
				lastChecked = null;
				priority = null;
			} else {
				lastChecked = this;
			}
		});
	});
});


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


function getTitle() {
	let title = document.getElementById('title');
	return title.value;
}


function getDescription() {
	let description = document.getElementById('description');
	return description.value;
}


function getAssignment() {
	let assignment = document.getElementById('assignment');
	return assignment.value;
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


function getPriority(id) {
	let radioButton = document.getElementById(`${id}`);
	priority = radioButton.value;
}


function saveToLocalStorage(task) {
	localStorage.setItem('task', JSON.stringify(task));
}


function createTask() {
	task = {
	'title': getTitle(),
	'description': getDescription(),
	'assignment': getAssignment(),
	'date': getDate(),
	'priority': priority,
	'category': getCategory(),
	'subtasks': getSubtask(),
	};
	saveToLocalStorage(task);
}


async function loadData(path='') {
	let response = await fetch(`${BASE_URL}${path}.json`);
	let responseToJson = await response.json();
	return responseToJson;
}


async function postData(path='', data={}) {
	let response = await fetch(`${BASE_URL}${path}.json`, {
		method: 'POST',
		header: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	});
	responseToJson = await response.json();
	return responseToJson;
}


async function deleteData(path='') {
	let response = await fetch(`${BASE_URL}${path}.json`, {
		method: 'DELETE',
	});
	responseToJson = await response.json();
	return responseToJson;
}
