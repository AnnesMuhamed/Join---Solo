async function init() {
	await includeHTML().then(loadUserData);
}

async function includeHTML() {
  let includeElements = document.queryselectorall("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getattribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerhtml = await resp.text();
    } else {
      element.innerhtml = "Page not found";
    }
  }
}

function goBack() {
  window.history.back();
}
