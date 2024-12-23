import { clearForm } from "./render.js"
import { addTask, createTaskObject } from "./tasks.js"

function addTaskListener(dialog, form) {
    const addTaskButton = document.querySelector('#add-task');
    addTaskButton.addEventListener("click", () => {
        clearForm(form);
        dialog.showModal();
    });
}

function priorityListener() {
    const taskPriority = document.querySelector("#task-priority");
    const taskPriorityButtons = document.querySelectorAll(".priority");
    taskPriorityButtons.forEach((button) => {
        button.addEventListener("click", () => {
            taskPriority.setAttribute('selected-priority', parseInt(button.getAttribute('pdata'), 10));
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

function saveTaskListener(closeDialogButton, taskList) {
    const saveTask = document.querySelector("#save-task");
    saveTask.addEventListener("click", (event) => {
        event.preventDefault();
        let task = getDialogData();
        addTask(task, taskList);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        console.log(taskList);
        closeDialogButton.click();
    });
}

function runDialogListeners(taskList) {
    const dialog = document.querySelector("dialog");
    const form = document.querySelector("#task-form");
    addTaskListener(dialog, form);
    priorityListener();
    const closeDialogButton = closeDialogListener(dialog);
    saveTaskListener(closeDialogButton, taskList);
}

function getDialogData() {
    const titleElement = document.querySelector("#task-title");
    const descriptionElement = document.querySelector("#task-description");
    const dueDateElement = document.querySelector("#task-dueDate");
    const taskPriorityElement = document.querySelector("#task-priority");

    let priority = taskPriorityElement.getAttribute('selected-priority');
    return createTaskObject(titleElement.value, descriptionElement.value, dueDateElement.value, priority);
}

export { runDialogListeners }
