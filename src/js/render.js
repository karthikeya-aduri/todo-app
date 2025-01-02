import { format } from "date-fns";
import { PRIORITY_MAP, WINDOW_MAP } from "./constants.js";
import { filterTaskList } from "./menu.js";
import { getTasksFromLocalStorage } from "./tasks.js";

function clearForm(form) {
    form.reset();
}

function getPriority(priority_str) {
    return PRIORITY_MAP.get(priority_str);
}

function switchWindow(option) {
    let taskList;
    if (option !== "all")
        taskList = getTasksFromLocalStorage(option);
    else
        taskList = getTasksFromLocalStorage("not-completed").concat(getTasksFromLocalStorage("completed"));
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

function createTaskData(taskList, i) {
    const task = taskList[i];

    const taskData = createElement('div', {}, { display: 'flex', flexDirection: 'column', gap: '10px' });

    const taskTitle = createElement('h3');
    taskTitle.innerText = task.title;

    const taskDescription = createElement('p');
    taskDescription.innerText = task.description;

    const taskDueDate = createElement('p');
    taskDueDate.innerText = "Due Date : " + format(task.dueDate, "dd-MM-yyyy");

    const taskPriority = createElement('p');
    taskPriority.innerText = "Priority : " + getPriority(task.priority);

    const taskStatus = createElement(
        'button',
        { class: 'task-buttons', id: 'status' },
        {},
        [{
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
            }
        }]
    );
    taskStatus.innerText = task.status;

    taskData.append(taskTitle, taskDueDate, taskPriority, taskStatus);

    return taskData;
}

function createTaskButtons(taskList, i) {
    const buttonsContainer = createElement(
        'div',
        {},
        { display: 'flex', gap: '20px', alignSelf: 'center' }
    );

    const editButton = createElement(
        'button',
        { class: 'task-buttons', id: 'edit-button' }
    );
    editButton.innerText = "✎";

    const removeButton = createElement(
        'button',
        { class: 'task-buttons', id: 'remove-button' },
        {},
        [{
            event: "click",
            handler: () => {
                console.log("removed");
                const task = taskList[i];
                taskList.splice(i, 1);
                if (task.status === "Completed")
                    localStorage.setItem("completed", JSON.stringify(taskList));
                else
                    localStorage.setItem("not-completed", JSON.stringify(taskList));
                reloadTaskContainer();
            }
        }]
    );
    removeButton.innerText = "🗑";

    buttonsContainer.append(editButton, removeButton);
    return buttonsContainer;
}

function createEditDialog() {
    const editDialog = createElement('dialog');
    const editForm = createElement('form');
    editDialog.appendChild(editForm);
    return editDialog;
}

function createTaskElement(taskList, i) {
    const taskContainer = createElement('div', { class: 'task' });
    const taskData = createTaskData(taskList, i);
    const buttonsContainer = createTaskButtons(taskList, i);
    const editDialog = createEditDialog();

    taskContainer.append(taskData, editDialog, buttonsContainer);

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
