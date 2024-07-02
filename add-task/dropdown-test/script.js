const BASE_URL = 'https://join-232-default-rtdb.europe-west1.firebasedatabase.app/';
let path = 'contacts';
let expanded = false;
let contacts = null;


document.addEventListener('DOMContentLoaded', function() {
	initFunc();
	document.body.addEventListener('click', collapseCheckboxes);
	document.body.addEventListener('click', assignContacts);
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
		let checkboxId = this.id;
		console.log(checkboxId);
		let initials = getInitials(checkboxId);
		assignments.innerHTML += `
			<span>${initials}</span>
		`;
	}
}


function filterCheckboxes(id) {
	let filter = document.getElementById('search');
	let inputValue = filter.value.toLowerCase();
	let fullName = `${contacts[id].firstName.toLowerCase()} ${contacts[id].lastName.toLowerCase()}`;
	return (fullName.includes(inputValue));
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
	}
}


function showCheckboxes() {
	let checkboxes = document.getElementById('checkboxes');
	if (!expanded) {
		checkboxes.style.display = 'block';
		expanded = true;
	} else {
		checkboxes.style.display = 'none';
		expanded = false;
	}
}


function collapseCheckboxes(event) {
	let checkboxes = document.getElementById('checkboxes');
	let search = document.getElementById('search');
	if(!event.target.closest('.wrapper')) {
		search.value = '';
		renderCheckboxes();
		checkboxes.style.display = 'none';
		expanded = false;
	}
}
