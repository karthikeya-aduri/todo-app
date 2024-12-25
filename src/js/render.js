import { format } from "date-fns";
import { priorityMap, windowMap } from "./constants.js";
import { filterTaskList } from "./menu.js";
import { getTasksFromLocalStorage } from "./tasks.js";

function clearForm(form) {
    form.reset();
}

function getPriority(priority_str) {
    return priorityMap.get(priority_str);
}

function reloadTaskContainer() {
    const taskContainer = document.querySelector("#task-container");
    const currentWindow = taskContainer.getAttribute("current-window");
    const option = windowMap.get(currentWindow);
    let taskList;
    if (option !== "all") {
        taskList = getTasksFromLocalStorage(option);
    }
    else {
        let incompleteList = getTasksFromLocalStorage("tasks");
        let completedList = getTasksFromLocalStorage("completed");
        taskList = incompleteList.concat(completedList);
    }
    renderTasksFromAList(taskList);
}

function createTaskElement(taskList, i) {
    let task = taskList[i];
    let taskContainer = document.createElement('div');
    let taskTitle = document.createElement('h3');
    let taskDescription = document.createElement('p');
    let taskDueDate = document.createElement('p');
    let taskPriority = document.createElement('p');
    let taskStatus = document.createElement('button');
    let editDialog = document.createElement('dialog');
    let editForm = document.createElement('form');
    let edit = document.createElement('button');

    taskStatus.addEventListener("click", (event) => {
        event.target.innerText = (event.target.innerText === "Not Completed") ? "Completed" : "Not Completed";
        task.status = event.target.innerText;
        filterTaskList(taskList);
        reloadTaskContainer();
    });

    taskTitle.innerText = task.title;
    taskDescription.innerText = task.description;
    taskDueDate.innerText = "Due Date : " + format(task.dueDate, "dd-MM-yyyy");
    taskPriority.innerText = "Priority : " + getPriority(task.priority);
    taskStatus.innerText = task.status;

    taskContainer.appendChild(taskTitle);
    taskContainer.appendChild(taskDueDate);
    taskContainer.appendChild(taskDueDate);
    taskContainer.appendChild(taskPriority);
    taskContainer.appendChild(taskStatus);
    taskContainer.classList.add('task');

    return taskContainer;
}

function clearTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach((task) => {
        task.remove();
    });
}

function renderTasksFromAList(taskList) {
    clearTasks();
    const taskContainer = document.querySelector('#task-container');
    for (let i in taskList) {
        let task = createTaskElement(taskList, i);
        taskContainer.appendChild(task);
    }
}

export { clearForm, createTaskElement, reloadTaskContainer, renderTasksFromAList }
