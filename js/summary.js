"use strict";

const PATH_TO_TASKS = "tasks";

/**
 * Initializes the page by including HTML content, greeting the user, and displaying task metrics.
 * It retrieves tasks from session storage and displays metrics if tasks are found, 
 * or logs an error if no tasks are available.
 */
async function init() {
  await includeHTML();
  greetUser();  // Diese Funktion wird sicherstellen, dass der Benutzer begrüßt wird
  const tasks = await getTasksFromSession();
  if (tasks) {
    showMetrics(tasks);
  } else {
    console.error("Keine Aufgaben im Session Storage gefunden.");
  }
}

/**
 * Retrieves tasks from the session storage and parses the JSON data.
 * If no tasks are found in session storage, it returns null.
 * 
 * @returns {Object|null} - The parsed tasks object, or null if no tasks are found.
 */
async function getTasksFromSession() {
  const tasks = sessionStorage.getItem("tasks");
  if (!tasks) {
    await sessionStoreTasks(); // Tasks aus dem Remote-Server laden und speichern
  }
  return JSON.parse(sessionStorage.getItem("tasks"));
}

/**
 * Includes external HTML content into the page by fetching files specified in the "w3-include-html" attribute.
 * If the file is successfully fetched, its content is inserted into the element. 
 * If the file is not found or an error occurs, an error message is displayed in the element.
 */
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

/**
 * Greets the user by displaying a personalized message with their name, 
 * retrieved from either local storage or session storage.
 * If the user is found, their full name is displayed on the page, 
 * along with a "Good morning" greeting.
 */
function greetUser() {
  let user = JSON.parse(localStorage.getItem("loggedInUser")) || JSON.parse(sessionStorage.getItem("loggedInUser"));

  const greetElement = document.querySelector(".rp-gm");
  const greetedUserField = document.querySelector("#sofia"); 

  if (user) {
      const userName = `${user.firstname} ${user.lastname}`;
      greetElement.textContent = `Good morning`; 
      greetedUserField.classList.remove("hidden"); 
      greetedUserField.textContent = userName;   
  } else {
      greetElement.textContent = "Good morning"; 
      greetedUserField.classList.add("hidden"); 
  }
}

/**
 * Fetches tasks from a remote source and stores them in session storage.
 * 
 * @returns {Promise<void>} - A promise that resolves when the tasks are successfully loaded and stored.
 */
async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

/**
 * Counts the number of tasks that are in a specific state.
 * 
 * @param {Object} tasks - The tasks object, where each task has a state property.
 * @param {string} state - The state to filter the tasks by (e.g., 'todo', 'in-progress').
 * @returns {number} - The number of tasks in the specified state.
 */
function countTasksByState(tasks, state) {
  return Object.values(tasks).filter(task => task.state === state).length;
}

/**
 * Counts the total number of tasks.
 * 
 * @param {Object} tasks - The tasks object, where each task is a key-value pair.
 * @returns {number} - The total number of tasks.
 */
function countTotalTasks(tasks) {
  return Object.keys(tasks).length;
}

/**
 * Counts the number of tasks that are marked as urgent (priority "3").
 * 
 * @param {Object} tasks - The tasks object, where each task has a priority property.
 * @returns {number} - The number of tasks with an urgent priority.
 */
function countUrgentTasks(tasks) {
  return Object.values(tasks).filter(task => task.priority === "3").length;
}

/**
 * Finds the task with the closest due date that has a priority of "3" (urgent).
 * Compares the task dates to the current date and returns the closest upcoming due date.
 * 
 * @param {Object} tasks - The tasks object, where each task has a date and priority property.
 * @returns {Date|null} - The closest due date for urgent tasks, or null if no urgent tasks are found.
 */
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

/**
 * Formats a date object into a readable string (e.g., "January 1, 2022").
 * If no date is provided, it returns null.
 * 
 * @param {Date|string} date - The date to format, either as a Date object or a string.
 * @returns {string|null} - The formatted date string, or null if no date is provided.
 */
function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Displays various metrics based on the tasks, such as the count of open, done, in-progress, and closed tasks,
 * the total number of tasks, the number of urgent tasks, and the closest due date for urgent tasks.
 * It updates the text content of corresponding elements in the HTML.
 * 
 * @param {Object} tasks - The tasks object containing all the task data.
 */
function showMetrics(tasks) {
  document.getElementById("open-tasks").textContent = countTasksByState(tasks, "open");
  document.getElementById("done-tasks").textContent = countTasksByState(tasks, "done");
  document.getElementById("in-progress-tasks").textContent = countTasksByState(tasks, "in-progress");
  document.getElementById("closed-tasks").textContent = countTasksByState(tasks, "closed");
  document.getElementById("total-tasks").textContent = countTotalTasks(tasks);
  document.getElementById("urgent-tasks").textContent = countUrgentTasks(tasks);
  document.getElementById("date-tasks").textContent = formatDate(findClosestDate(tasks));
}