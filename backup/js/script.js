'use strict';

async function includeHTML() {
  const includeElements = document.querySelectorAll("[w3-include-html]");
  for (const element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      const response = await fetch(file);
      if (response.ok) {
        element.innerHTML = await response.text();
      } else {
        element.innerHTML = "Page not found";
      }
    } catch (error) {
      element.innerHTML = "Error loading page";
    }
  }
  includeCSS();
  includeJS();
}

function includeCSS() {
  const cssFiles = document.querySelectorAll("[w3-include-css]");
  cssFiles.forEach(fileElement => {
    const file = fileElement.getAttribute("w3-include-css");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    document.head.appendChild(link);
  });
}

function includeJS() {
  const jsFiles = document.querySelectorAll("[w3-include-js]");
  jsFiles.forEach(fileElement => {
    const file = fileElement.getAttribute("w3-include-js");
    const script = document.createElement("script");
    script.src = file;
    document.body.appendChild(script);
  });
}

includeHTML();




