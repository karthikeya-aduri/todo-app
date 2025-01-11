import { clearForm, reloadTaskContainer, createElement } from "./render.js";
import { createTaskObject, getTasksFromLocalStorage } from "./tasks.js";

function getDialogData(queries) {
  const titleElement = document.querySelector(queries[0]);
  const descriptionElement = document.querySelector(queries[1]);
  const dueDateElement = document.querySelector(queries[2]);
  const taskPriorityElement = document.querySelector(queries[3]);

  let priority = taskPriorityElement.getAttribute("selected-priority");
  const status = "Not Completed";
  let project = document.querySelector(queries[4]);
  return createTaskObject(
    titleElement.value,
    descriptionElement.value,
    dueDateElement.value,
    priority,
    status,
    project.value,
  );
}

function createProjectOptions(query, start) {
  const selectProject = document.querySelector(query);
  const options = document.querySelectorAll(`${query}>option`);
  options.forEach((option) => {
    option.remove();
  });
  let projectList = JSON.parse(localStorage.getItem("projects"));
  for (let i = start; i < projectList.length; i++) {
    let option = createElement("option", { value: `${projectList[i]}` });
    option.innerText = projectList[i];
    selectProject.append(option);
  }
}

function addTaskListener(dialog, form) {
  const addTaskButton = document.querySelector("#add-task");
  addTaskButton.addEventListener("click", () => {
    clearForm(form);
    createProjectOptions("#select-project", 0);
    dialog.showModal();
  });
}

function priorityListener(query) {
  const taskPriority = document.querySelector(query);
  const taskPriorityButtons = document.querySelectorAll(`${query}>*`);
  taskPriorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      taskPriority.setAttribute(
        "selected-priority",
        parseInt(button.getAttribute("pdata"), 10),
      );
    });
  });
}

function closeDialogListener(dialog) {
  const closeDialogButton = document.querySelector("#close-dialog");
  closeDialogButton.addEventListener("click", () => {
    dialog.close();
  });
  return closeDialogButton;
}

function saveTaskListener(closeDialogButton) {
  const saveTask = document.querySelector("#save-task");
  saveTask.addEventListener("click", (event) => {
    event.preventDefault();
    let taskList = getTasksFromLocalStorage("not-completed");
    const queries = [
      "#task-title",
      "#task-description",
      "#task-dueDate",
      "#task-priority",
      "#select-project",
    ];
    let task = getDialogData(queries);
    taskList.push(task);
    localStorage.setItem("not-completed", JSON.stringify(taskList));
    closeDialogButton.click();
    reloadTaskContainer();
  });
}

function runDialogListeners() {
  const dialog = document.querySelector("dialog");
  const form = document.querySelector("#task-form");
  addTaskListener(dialog, form);
  priorityListener("#task-priority");
  const closeDialogButton = closeDialogListener(dialog);
  saveTaskListener(closeDialogButton);
}

export { runDialogListeners, getDialogData, createProjectOptions };
