import { format } from "date-fns";

class Task {
    constructor(title, description, dueDate, priority, status) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
}

function createTaskObject(title, description, dueDate, selectedPriority, status) {
    return new Task(title, description, dueDate, selectedPriority, status);
}

function addTask(task, taskList) {
    taskList.push(task)
}

function compareTasks(task1, task2) {
    return task1.dueDate - task2.dueDate;
}

function getTasksForToday(taskList) {
    let today = new Date();
    let currentDate = format(today, "yyyy-MM-dd");

    let todayList = [];
    for (let i in taskList) {
        if ((taskList[i].dueDate) === currentDate)
            todayList.push(Number(i));
    }
    return todayList;
}

export { createTaskObject, addTask, getTasksForToday, compareTasks }
