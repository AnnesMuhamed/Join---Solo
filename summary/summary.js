"use strict";

const PATH_TO_TASKS = "tasks";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  greetUser();
  await sessionStoreTasks();
  showMetrics();
}

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

function greetUser() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  }

  if (user) {
    const userName = `${user.firstName} ${user.lastName}`;
    let greetUserField = document.querySelector(".gm");
    let greetedUserField = document.querySelector(".sofia");
    greetedUserField.classList.remove("d-none");
    greetUserField.textContent = "Good morning,";
    greetedUserField.textContent = userName;
  }
}

window.onload = function () {
  if (window.innerWidth <= 1280) {
    document.getElementById("sectionGreet").style.display = "flex";
    document.getElementById("content").style.display = "none";

    setTimeout(function () {
      document.getElementById("sectionGreet").style.display = "none";
      document.getElementById("content").style.display = "block";
    }, 3000);
  } else {
    document.getElementById("sectionGreet").style.display = "none";
    document.getElementById("content").style.display = "block";
  }
};

async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

function countOpenTasks(tasks) {
  let openCount = 0;
  for (let key in tasks) {
    if (tasks[key].state === "open") {
      openCount++;
    }
  }
  return openCount;
}

function countDoneTasks(tasks) {
  let doneCount = 0;
  for (let key in tasks) {
    if (tasks[key].state === "done") {
      doneCount++;
    }
  }
  return doneCount;
}

function countInProgressTasks(tasks) {
  let inProgressCount = 0;
  for (let key in tasks) {
    if (tasks[key].state === "in-progress") {
      inProgressCount++;
    }
  }
  return inProgressCount;
}

function countClosedTasks(tasks) {
  let closedCount = 0;
  for (let key in tasks) {
    if (tasks[key].state === "closed") {
      closedCount++;
    }
  }
  return closedCount;
}

function countTotalTasks(tasks) {
  return Object.keys(tasks).length;
}

function countUrgentTasks(tasks) {
  let urgentCount = 0;
  for (let key in tasks) {
    if (tasks[key].priority === "3") {
      urgentCount++;
    }
  }
  return urgentCount;
}

function findClosestDate(tasks) {
  let today = new Date();
  let closestDate = null;
  let closestDiff = Infinity;

  for (let key in tasks) {
    if (tasks[key].priority === "3") {
      let taskDate = new Date(tasks[key].date);

      if (!isNaN(taskDate)) {
        let diff = Math.abs(today - taskDate);

        if (diff < closestDiff) {
          closestDiff = diff;
          closestDate = taskDate;
        }
      }
    }
  }
  return closestDate;
}

function formatDate(date) {
  if (!date) return null;

  let options = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("en-US", options);
}

function showMetrics() {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let openTasks = document.getElementById("open-tasks");
  let doneTasks = document.getElementById("done-tasks");
  let inProgressTasks = document.getElementById("in-progress-tasks");
  let closedTasks = document.getElementById("closed-tasks");
  let totalTasks = document.getElementById("total-tasks");
  let urgentTasks = document.getElementById("urgent-tasks");
  let dateTasks = document.getElementById("date-tasks");
  openTasks.textContent = `${countOpenTasks(tasks)}`;
  doneTasks.textContent = `${countDoneTasks(tasks)}`;
  inProgressTasks.textContent = `${countInProgressTasks(tasks)}`;
  closedTasks.textContent = `${countClosedTasks(tasks)}`;
  totalTasks.textContent = `${countTotalTasks(tasks)}`;
  urgentTasks.textContent = `${countUrgentTasks(tasks)}`;
  dateTasks.textContent = `${formatDate(findClosestDate(tasks))}`;
}
