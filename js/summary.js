"use strict";

const PATH_TO_TASKS = "tasks";

async function init() {
  await includeHTML();
  greetUser();
  const tasks = getTasksFromSession();
  if (tasks) {
    showMetrics(tasks);
  } else {
    console.error("Keine Aufgaben im Session Storage gefunden.");
  }
}

function getTasksFromSession() {
  const tasks = sessionStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : null;
}

async function includeHTML() {
  const includeElements = document.querySelectorAll("[w3-include-html]");
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      const resp = await fetch(file);
      if (resp.ok) {
        element.innerHTML = await resp.text();
      } else {
        element.innerHTML = "Page not found";
      }
    } catch (error) {
      element.innerHTML = "Error loading content.";
    }
  }
}

function greetUser() {
  let user = JSON.parse(localStorage.getItem("loggedInUser")) || JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (user) {
    const userName = `${user.firstname} ${user.lastname}`;
    document.querySelector(".rp-gm").textContent = "Good morning,";
    const greetedUserField = document.querySelector(".rp-sofia");
    greetedUserField.classList.remove("d-none");
    greetedUserField.textContent = userName;
  }
}

async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

function countTasksByState(tasks, state) {
  return Object.values(tasks).filter(task => task.state === state).length;
}

function countTotalTasks(tasks) {
  return Object.keys(tasks).length;
}

function countUrgentTasks(tasks) {
  return Object.values(tasks).filter(task => task.priority === "3").length;
}

function findClosestDate(tasks) {
  const today = new Date();
  let closestDate = null;
  let closestDiff = Infinity;

  Object.values(tasks).forEach(task => {
    if (task.priority === "3" && task.date) {
      const taskDate = new Date(task.date);
      const diff = Math.abs(today - taskDate);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestDate = taskDate;
      }
    }
  });
  return closestDate;
}

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function showMetrics(tasks) {
  document.getElementById("open-tasks").textContent = countTasksByState(tasks, "open");
  document.getElementById("done-tasks").textContent = countTasksByState(tasks, "done");
  document.getElementById("in-progress-tasks").textContent = countTasksByState(tasks, "in-progress");
  document.getElementById("closed-tasks").textContent = countTasksByState(tasks, "closed");
  document.getElementById("total-tasks").textContent = countTotalTasks(tasks);
  document.getElementById("urgent-tasks").textContent = countUrgentTasks(tasks);
  document.getElementById("date-tasks").textContent = formatDate(findClosestDate(tasks));
}
