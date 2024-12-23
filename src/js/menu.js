import { renderTasksForToday } from "./render.js"

function removeAllListener() {
    const removeAllButton = document.querySelector("#remove-all");
    removeAllButton.addEventListener("click", () => {
        localStorage.removeItem("tasks");
        location.reload();
    });
}

function todayButtonListener(taskList) {
    const todayButton = document.querySelector("#show-today");
    todayButton.addEventListener("click", () => {
        renderTasksForToday(taskList);
    });
}

function runMenuListeners(taskList) {
    todayButtonListener(taskList);
    removeAllListener();
}

export { runMenuListeners }
