import { format } from "date-fns";
import { PRIORITY_MAP, WINDOW_MAP } from "./constants.js";
import { filterTaskList } from "./menu.js";
import { getTasksFromLocalStorage } from "./tasks.js";
import { createProjectOptions, getDialogData } from "./dialog.js";

function clearForm(form) {
  form.reset();
}

function getPriority(priority_str) {
  return PRIORITY_MAP.get(priority_str);
}

function switchWindow(option) {
  let taskList;
  if (option !== "all") taskList = getTasksFromLocalStorage(option);
  else
    taskList = getTasksFromLocalStorage("not-completed").concat(
      getTasksFromLocalStorage("completed"),
    );
  return taskList;
}

function reloadTaskContainer() {
  const taskContainer = document.querySelector("#task-container");
  const currentWindow = taskContainer.getAttribute("current-window");
  const option = WINDOW_MAP.get(currentWindow);
  const taskList = switchWindow(option);
  renderTasksFromAList(taskList);
}

function createElement(tag, attributes = {}, styles = {}, eventListeners = []) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value;
  }

  for (const { event, handler } of eventListeners) {
    element.addEventListener(event, handler);
  }

  return element;
}

function createTaskData(taskList, i, projectFlag) {
  const task = taskList[i];

  const taskData = createElement(
    "div",
    {},
    { display: "flex", flexDirection: "column", gap: "10px" },
  );

  const taskTitle = createElement("h3");
  taskTitle.innerText = task.title;

  const taskDescription = createElement("p");
  taskDescription.innerText = task.description;

  const taskDueDate = createElement("p");
  taskDueDate.innerText = "Due Date : " + format(task.dueDate, "dd-MM-yyyy");

  const taskPriority = createElement("p");
  taskPriority.innerText = "Priority : " + getPriority(task.priority);

  let taskStatus;
  if (projectFlag) {
    taskStatus = createElement("p");
    taskStatus.innerText = task.status;
  } else {
    taskStatus = createElement(
      "button",
      { class: "task-buttons", id: "status" },
      {},
      [
        {
          event: "click",
          handler: (event) => {
            if (event.target.innerText === "Not Completed") {
              event.target.innerText = "Completed";
              task.status = event.target.innerText;
              filterTaskList(taskList, "completed");
            } else {
              event.target.innerText = "Not Completed";
              task.status = event.target.innerText;
              filterTaskList(taskList, "not-completed");
            }
            reloadTaskContainer();
          },
        },
      ],
    );
    taskStatus.innerText = task.status;
  }

  const project = createElement("p");
  project.innerText = `Project : ${taskList[i].project}`;

  taskData.append(
    taskTitle,
    taskDescription,
    taskDueDate,
    taskPriority,
    project,
    taskStatus,
  );

  return taskData;
}

function createTaskButtons(taskList, i) {
  let editDialog;

  const buttonsContainer = createElement(
    "div",
    {},
    { display: "flex", gap: "20px", alignSelf: "center" },
  );

  const editButton = createElement(
    "button",
    { class: "task-buttons", class: "edit-button" },
    {},
    [
      {
        event: "click",
        handler: () => {
          const taskDialog = document.querySelector("#task-dialog");
          editDialog = document.querySelector("#edit-dialog");
          if (editDialog) {
            editDialog.remove();
          }
          editDialog = createEditDialog(taskList, i);
          taskDialog.before(editDialog);
          createProjectOptions("#select-new-project", 0);
          editDialog.showModal();
        },
      },
    ],
  );
  editButton.innerText = "✎";

  const removeButton = createElement(
    "button",
    { class: "task-buttons", class: "remove-button" },
    {},
    [
      {
        event: "click",
        handler: () => {
          const task = taskList[i];
          taskList.splice(i, 1);
          if (task.status === "Completed")
            localStorage.setItem("completed", JSON.stringify(taskList));
          else localStorage.setItem("not-completed", JSON.stringify(taskList));
          reloadTaskContainer();
        },
      },
    ],
  );
  removeButton.innerText = "🗑";

  buttonsContainer.append(editButton, removeButton);
  return buttonsContainer;
}

function createEditForm(taskList, i, closeEditDialogButton) {
  const editForm = createElement("form");

  const titleInput = createElement("input", {
    type: "text",
    id: "edit-task-title",
    placeholder: "Enter a new task title",
  });

  const descriptionInput = createElement("input", {
    type: "text",
    id: "edit-task-description",
    placeholder: "Enter a new task description",
  });

  const dueDateLabel = createElement("label");
  const dueDateInput = createElement("input", {
    type: "date",
    id: "edit-task-dueDate",
  });

  const priorityButtons = createElement("div", { "selected-priority": "0" });
  priorityButtons.id = "edit-task-priority";
  const lowPriority = createElement("button", {
    type: "button",
    class: "priority",
    pdata: "1",
  });
  const mediumPriority = createElement("button", {
    type: "button",
    class: "priority",
    pdata: "2",
  });
  const highPriority = createElement("button", {
    type: "button",
    class: "priority",
    pdata: "3",
  });
  const selectProject = createElement("select", { id: "select-new-project" });

  const saveTask = createElement("button", {
    id: "save-edited-task",
    type: "submit",
  });

  dueDateLabel.innerText = "New Due Date:";
  lowPriority.innerText = "Low";
  mediumPriority.innerText = "Medium";
  highPriority.innerText = "High";
  saveTask.innerText = "Save Task";

  lowPriority.addEventListener("click", () => {
    priorityButtons.setAttribute(
      "selected-priority",
      parseInt(lowPriority.getAttribute("pdata"), 10),
    );
  });

  mediumPriority.addEventListener("click", () => {
    priorityButtons.setAttribute(
      "selected-priority",
      parseInt(mediumPriority.getAttribute("pdata"), 10),
    );
  });

  highPriority.addEventListener("click", () => {
    priorityButtons.setAttribute(
      "selected-priority",
      parseInt(highPriority.getAttribute("pdata"), 10),
    );
  });

  saveTask.addEventListener("click", (event) => {
    event.preventDefault();
    const queries = [
      "#edit-task-title",
      "#edit-task-description",
      "#edit-task-dueDate",
      "#edit-task-priority",
      "#select-new-project",
    ];
    let task = getDialogData(queries);
    if (task.title !== "") taskList[i].title = task.title;
    if (task.description !== "") taskList[i].description = task.description;
    if (task.dueDate !== "") taskList[i].dueDate = task.dueDate;
    if (task.priority !== "0") taskList[i].priority = task.priority;
    if (task.project) taskList[i].project = task.project;
    if (taskList[i].status === "Completed")
      localStorage.setItem("completed", JSON.stringify(taskList));
    else localStorage.setItem("not-completed", JSON.stringify(taskList));
    closeEditDialogButton.click();
    reloadTaskContainer();
  });

  priorityButtons.append(lowPriority, mediumPriority, highPriority);
  editForm.append(
    titleInput,
    descriptionInput,
    dueDateLabel,
    dueDateInput,
    priorityButtons,
    selectProject,
    saveTask,
  );
  editForm.id = "edit-form";

  return editForm;
}

function createEditDialog(taskList, i) {
  const editDialog = createElement("dialog");
  const closeEditDialogButton = createElement(
    "button",
    { id: "close-edit-dialog" },
    {},
    [
      {
        event: "click",
        handler: () => {
          editDialog.close();
        },
      },
    ],
  );
  closeEditDialogButton.innerText = "Close";
  const editForm = createEditForm(taskList, i, closeEditDialogButton);
  editDialog.append(editForm, closeEditDialogButton);
  editDialog.id = "edit-dialog";
  return editDialog;
}

function createTaskElement(taskList, i, projectFlag) {
  const taskContainer = createElement("div", { class: "task" });
  const taskData = createTaskData(taskList, i, projectFlag);
  if (projectFlag === false) {
    const buttonsContainer = createTaskButtons(taskList, i);
    taskContainer.append(taskData, buttonsContainer);
  } else {
    const project = createElement("p");
    project.innerText = taskList[i].project;

    taskContainer.append(taskData);
  }

  return taskContainer;
}

function clearTasks() {
  const tasks = document.querySelectorAll(".task");
  const projects = document.querySelector("#project-container");
  if (projects) projects.remove();
  tasks.forEach((task) => {
    task.remove();
  });
}

function renderTasksFromAList(taskList, projectFlag = false) {
  clearTasks();
  const taskContainer = document.querySelector("#task-container");
  for (let i in taskList) {
    let task = createTaskElement(taskList, i, projectFlag);
    taskContainer.appendChild(task);
  }
}

export {
  clearForm,
  clearTasks,
  createTaskElement,
  reloadTaskContainer,
  renderTasksFromAList,
  createElement,
};
