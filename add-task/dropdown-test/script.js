const BASE_URL = 'https://join-232-default-rtdb.europe-west1.firebasedatabase.app/';
let path = 'contacts';
let expanded = false;
let contacts = null;


document.addEventListener('DOMContentLoaded', function() {
	initFunc();
	let searchInput = document.getElementById('search');
	document.body.addEventListener('click', showCheckboxes);
	document.body.addEventListener('click', collapseCheckboxes);
	document.body.addEventListener('click', assignContacts);
	searchInput.addEventListener('keyup', function() {
		renderCheckboxes();
	});
});


async function initFunc() {
	await loadContacts();
	renderCheckboxes();
}


async function loadData(path='') {
	let response = await fetch(`${BASE_URL}${path}.json`);
	let responseToJson = await response.json();
	return responseToJson;
}


async function loadContacts() {
	contacts = await loadData(path);
}


function getContactsIds() {
	let contactsIds = [];
	for(let id in contacts) {
		contactsIds.push(id);
	}
	return contactsIds;
}


function getInitials(id) {
	return `${contacts[id]['firstName'].charAt(0)}${contacts[id]['lastName'].charAt(0)}`;
}


function assignContacts(event) {
	let assignments = document.getElementById('assigned-contacts');
	if(event.target.type === 'checkbox') {
		let checkboxId = event.target.id;
		let initials = getInitials(checkboxId);
		let initialsElement = document.getElementById(`${checkboxId}-${initials}`);
		if(initialsElement) {
			initialsElement.remove();
		} else {
			assignments.innerHTML += `
				<span id="${checkboxId}-${initials}">${initials}</span>
		`;
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
		let initials = getInitials(id);
		if(!(filterCheckboxes(id))) {
			continue;
		}
		checkboxes.innerHTML += `
			<label for="${id}">
				<span>${initials}</span>
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
	if(!event.target.closest('.wrapper')) {
		search.value = '';
		checkboxes.style.display = 'none';
		expanded = false;
	}
}
