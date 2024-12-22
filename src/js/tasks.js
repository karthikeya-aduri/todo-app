class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

function createTaskObject(selectedPriority) {
    const title = document.querySelector("#task-title");
    const description = document.querySelector("#task-description");
    const dueDate = document.querySelector("#task-dueDate");
    return new Task(title.value, description.value, dueDate.value, selectedPriority);
}

export function addTask(taskList) {
    const addTask = document.querySelector('#add-task');
    const closeDialog = document.querySelector("#close-dialog");
    const saveTask = document.querySelector("#save-task");
    const dialog = document.querySelector("dialog");

    addTask.addEventListener("click", () => {
        dialog.showModal();
    });

    closeDialog.addEventListener("click", () => {
        dialog.close();
    });

    const lowPriority = document.querySelector("#low-priority");
    const mediumPriority = document.querySelector("#medium-priority");
    const highPriority = document.querySelector("#high-priority");
    let selectedPriority = null
    lowPriority.addEventListener("click", () => { selectedPriority = 1; });
    mediumPriority.addEventListener("click", () => { selectedPriority = 2; });
    highPriority.addEventListener("click", () => { selectedPriority = 3; });

    saveTask.addEventListener("click", (event) => {
        event.preventDefault();
        if (selectedPriority) {
            let task = createTaskObject(selectedPriority);
            taskList.push(task);
            closeDialog.click();
        }
        else {
            alert("Please select priority before adding");
        }
    });
}
