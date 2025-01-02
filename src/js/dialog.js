import { clearForm, reloadTaskContainer } from "./render.js"
import { createTaskObject, getTasksFromLocalStorage } from "./tasks.js"

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

function saveTaskListener(closeDialogButton) {
    const saveTask = document.querySelector("#save-task");
    saveTask.addEventListener("click", (event) => {
        event.preventDefault();
        let taskList = getTasksFromLocalStorage("not-completed");
        let task = getDialogData();
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
    priorityListener();
    const closeDialogButton = closeDialogListener(dialog);
    saveTaskListener(closeDialogButton);
}

function getDialogData() {
    const titleElement = document.querySelector("#task-title");
    const descriptionElement = document.querySelector("#task-description");
    const dueDateElement = document.querySelector("#task-dueDate");
    const taskPriorityElement = document.querySelector("#task-priority");

    let priority = taskPriorityElement.getAttribute('selected-priority');
    const status = "Not Completed"
    return createTaskObject(titleElement.value, descriptionElement.value, dueDateElement.value, priority, status);
}

export { runDialogListeners }
