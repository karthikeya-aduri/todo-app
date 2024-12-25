import { reloadTaskContainer, renderTasksFromAList } from "./render.js"
import { getTasksForToday, getTasksFromLocalStorage } from "./tasks.js";

function filterTaskList(taskList) {
    const incompleteTasks = taskList.filter(task => task.status !== "Completed");
    const newCompletedTasks = taskList.filter(task => task.status === "Completed");
    let oldCompletedTasks = getTasksFromLocalStorage("completed");
    let completedTasks = oldCompletedTasks.concat(newCompletedTasks);
    localStorage.setItem("tasks", JSON.stringify(incompleteTasks));
    localStorage.setItem("completed", JSON.stringify(completedTasks));
}

function removeCompletedListener() {
    const removeCompletedButton = document.querySelector("#remove-completed");
    removeCompletedButton.addEventListener("click", () => {
        localStorage.removeItem("completed");
        reloadTaskContainer();
    });
}

function todayButtonListener() {
    const todayButton = document.querySelector("#show-today");
    todayButton.addEventListener("click", () => {
        const taskContainer = document.querySelector("#task-container");
        taskContainer.setAttribute("current-window", "today");
        const taskList = getTasksFromLocalStorage("tasks");
        const todayList = getTasksForToday(taskList);
        renderTasksFromAList(todayList);
    });
}

function allTasksListener() {
    const allTasksButton = document.querySelector("#show-all");
    allTasksButton.addEventListener("click", () => {
        const taskContainer = document.querySelector("#task-container");
        taskContainer.setAttribute("current-window", "all-tasks");
        reloadTaskContainer();
    });
}

function completedTasksListener() {
    const completedTasksButton = document.querySelector("#show-completed");
    completedTasksButton.addEventListener("click", () => {
        const taskContainer = document.querySelector("#task-container");
        taskContainer.setAttribute("current-window", "completed-tasks");
        reloadTaskContainer();
    });
}

function runMenuListeners() {
    todayButtonListener();
    allTasksListener();
    completedTasksListener();
    removeCompletedListener();
}

export { runMenuListeners, filterTaskList, todayButtonListener }
