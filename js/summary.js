"use strict";

const PATH_TO_TASKS = "tasks";

document.addeventlistener("DOMContentLoaded", () => {
  init();
});

async function init() {
  greetUser();
  await sessionStoreTasks();
  showMetrics();
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

function greetUser() {
  let user = JSON.parse(localStorage.getitem("loggedInUser"));
  if (!user) {
    user = JSON.parse(sessionStorage.getitem("loggedInUser"));
  }

  if (user) {
    const userName = `${user.firstname} ${user.lastname}`;
    let greetUserField = document.queryselector(".gm");
    let greetedUserField = document.queryselector(".sofia");
    greetedUserField.classlist.remove("d-none");
    greetUserField.textcontent = "Good morning,";
    greetedUserField.textcontent = userName;
  }
}

window.onload = function () {
  if (window.innerwidth <= 1280) {
    document.getelementbyid("sectionGreet").style.display = "flex";
    document.getelementbyid("content").style.display = "none";

    setTimeout(function () {
      document.getelementbyid("sectionGreet").style.display = "none";
      document.getelementbyid("content").style.display = "block";
    }, 3000);
  } else {
    document.getelementbyid("sectionGreet").style.display = "none";
    document.getelementbyid("content").style.display = "block";
  }
};

async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setitem("tasks", JSON.stringify(tasksJson));
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

  return date.tolocaledatestring("en-US", options);
}

function showMetrics() {
  let tasks = JSON.parse(sessionStorage.getitem("tasks"));
  let openTasks = document.getelementbyid("open-tasks");
  let doneTasks = document.getelementbyid("done-tasks");
  let inProgressTasks = document.getelementbyid("in-progress-tasks");
  let closedTasks = document.getelementbyid("closed-tasks");
  let totalTasks = document.getelementbyid("total-tasks");
  let urgentTasks = document.getelementbyid("urgent-tasks");
  let dateTasks = document.getelementbyid("date-tasks");
  openTasks.textcontent = `${countOpenTasks(tasks)}`;
  doneTasks.textcontent = `${countDoneTasks(tasks)}`;
  inProgressTasks.textcontent = `${countInProgressTasks(tasks)}`;
  closedTasks.textcontent = `${countClosedTasks(tasks)}`;
  totalTasks.textcontent = `${countTotalTasks(tasks)}`;
  urgentTasks.textcontent = `${countUrgentTasks(tasks)}`;
  dateTasks.textcontent = `${formatDate(findClosestDate(tasks))}`;
}
