import { reloadTaskContainer, renderTasksFromAList } from "./render.js";
import { getTasksForToday, getTasksFromLocalStorage } from "./tasks.js";
import moonImg from "../assets/moon.png";
import sunImg from "../assets/sun.png";
import menuLight from "../assets/menu-light.png";
import menuDark from "../assets/menu-Dark.png";

function filterTaskList(taskList, key) {
    const incompleteTasks = taskList.filter(task => task.status !== "Completed");
    const newCompletedTasks = taskList.filter(task => task.status === "Completed");
    let tasksFromKey = getTasksFromLocalStorage(key);
    let completedTasks = tasksFromKey.concat(newCompletedTasks);
    localStorage.setItem("not-completed", JSON.stringify(incompleteTasks));
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
        const taskList = getTasksFromLocalStorage("not-completed");
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

function toggleThemeListener() {
    const toggleButton = document.querySelector("#toggle-theme");
    toggleButton.addEventListener("click", () => {
        const root = document.documentElement;
        const themeIcon = document.querySelector("#toggle-theme>img");
        const menuIcon = document.querySelector("#menu-icon");
        if (themeIcon.id === "dark") {
            themeIcon.src = sunImg;
            themeIcon.id = "light";
            menuIcon.src = menuDark;
            root.style.setProperty("--mainBackgroundColor", "#161616");
            root.style.setProperty("--mainForegroundColor", "#FFFFFF");
            root.style.setProperty("--borderColor", "#FFFFFF");
            root.style.setProperty("--hoverColor", "#3F3F3F");
            localStorage.setItem("theme", JSON.stringify("dark"));
        }
        else {
            themeIcon.src = moonImg;
            themeIcon.id = "dark";
            menuIcon.src = menuLight;
            root.style.setProperty("--mainBackgroundColor", "#FFFFFF");
            root.style.setProperty("--mainForegroundColor", "#000000");
            root.style.setProperty("--borderColor", "#161616");
            root.style.setProperty("--hoverColor", "#B8B8B8");
            localStorage.setItem("theme", JSON.stringify("light"));
        }
    });
}

function runMenuListeners() {
    todayButtonListener();
    allTasksListener();
    completedTasksListener();
    removeCompletedListener();
    toggleThemeListener();
}

export { runMenuListeners, filterTaskList, todayButtonListener }
