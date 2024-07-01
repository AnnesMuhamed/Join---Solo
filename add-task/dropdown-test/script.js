const BASE_URL = 'https://join-232-default-rtdb.europe-west1.firebasedatabase.app/';
let path = 'contacts';
let expanded = false;
let contacts = null;


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


function renderCheckboxes() {
	let contactsIds = getContactsIds();
	let checkboxes = document.getElementById('checkboxes');
	checkboxes.innerHTML = '';
	for(let n = 0; n < contactsIds.length; n++) {
		let id = contactsIds[n];
		checkboxes.innerHTML += `
			<label for="${id}">
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
