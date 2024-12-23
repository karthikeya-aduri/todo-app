import "./imports.js"
import { runDialogListeners } from "./dialog.js";
import { runMenuListeners } from "./menu.js";

function main() {
    let tasks = localStorage.getItem("tasks");
    let taskList;
    if (tasks === null)
        taskList = [];
    else
        taskList = JSON.parse(tasks);
    runDialogListeners(taskList);
    runMenuListeners(taskList);
}

main();
