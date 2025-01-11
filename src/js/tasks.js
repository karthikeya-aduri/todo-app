import { format } from "date-fns";

class Task {
  constructor(title, description, dueDate, priority, status, project) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.project = project;
  }
}

function getTasksFromLocalStorage(key) {
  let tasks = localStorage.getItem(key);
  let taskList;
  if (tasks === null) taskList = [];
  else taskList = JSON.parse(tasks);
  return taskList;
}

function createTaskObject(
  title,
  description,
  dueDate,
  selectedPriority,
  status,
  project,
) {
  return new Task(
    title,
    description,
    dueDate,
    selectedPriority,
    status,
    project,
  );
}

function compareTasks(task1, task2) {
  return task1.dueDate - task2.dueDate;
}

function getTasksForToday(taskList) {
  let today = new Date();
  let currentDate = format(today, "yyyy-MM-dd");

  let todayList = [];
  for (let i in taskList) {
    if (taskList[i].dueDate === currentDate) todayList.push(taskList[i]);
  }
  return todayList;
}

export {
  getTasksFromLocalStorage,
  createTaskObject,
  getTasksForToday,
  compareTasks,
};
