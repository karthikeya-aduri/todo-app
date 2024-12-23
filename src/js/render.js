import { format } from "date-fns";
import { getTasksForToday } from "./tasks.js";
import { priorityMap } from "./constants.js";

function clearForm(form) {
    form.reset();
}

function getPriority(priority_str) {
    return priorityMap.get(priority_str);
}

function createTaskElement(task) {
    let taskContainer = document.createElement('div');
    let h3 = document.createElement('h3');
    let p = document.createElement('p');
    let ddate = document.createElement('p');
    let priority = document.createElement('p');
    let status = document.createElement('button');
    status.addEventListener("click", (event) => {
        event.target.innerText = (event.target.innerText === "Not Completed") ? "Completed" : "Not Completed";
        task.status = event.target.innerText;
    });

    h3.innerText = task.title;
    p.innerText = task.description;
    ddate.innerText = "Due Date : " + format(task.dueDate, "dd-MM-yyyy");
    priority.innerText = "Priority : " + getPriority(task.priority);
    status.innerText = task.status;

    taskContainer.appendChild(h3);
    taskContainer.appendChild(p);
    taskContainer.appendChild(ddate);
    taskContainer.appendChild(priority);
    taskContainer.appendChild(status);
    taskContainer.classList.add('task');

    return taskContainer;
}

function clearTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach((task) => {
        task.remove();
    });
}

function renderTasksForToday(taskList) {
    let todayList = getTasksForToday(taskList);
    clearTasks();
    const tasks = document.querySelector('#tasks');
    for (let i in todayList) {
        let task = createTaskElement(taskList[todayList[i]]);
        tasks.appendChild(task);
    }
}

export { clearForm, renderTasksForToday }
