'use strict';
const BASE_URL = '';
let path = '';


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
