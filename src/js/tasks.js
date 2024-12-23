class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

function createTaskObject(title, description, dueDate, selectedPriority) {
    return new Task(title, description, dueDate, selectedPriority);
}

function addTask(task, taskList) {
    taskList.push(task)
}

export { createTaskObject, addTask }
