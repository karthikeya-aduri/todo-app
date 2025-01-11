import {
  reloadTaskContainer,
  renderTasksFromAList,
  createElement,
  clearTasks,
} from "./render.js";
import { getTasksForToday, getTasksFromLocalStorage } from "./tasks.js";
import moonImg from "../assets/moon.png";
import sunImg from "../assets/sun.png";
import menuLight from "../assets/menu-light.png";
import menuDark from "../assets/menu-Dark.png";
import { createProjectOptions } from "./dialog.js";

function filterTaskList(taskList, key) {
  const incompleteTasks = taskList.filter(
    (task) => task.status !== "Completed",
  );
  const newCompletedTasks = taskList.filter(
    (task) => task.status === "Completed",
  );
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
    } else {
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

function createHoverButton(innerText, id) {
  const button = document.createElement("button");
  button.classList.add("hover-button");
  button.id = id;
  button.innerText = innerText;
  return button;
}

function createAddProjectDialog() {
  const addProjectDialog = document.createElement("dialog");
  addProjectDialog.id = "add-project-dialog";
  const addProjectForm = createElement("form", { id: "add-project-form" });
  const addProjectLabel = createElement("label");
  addProjectLabel.innerText = "Enter new project name:";
  const addProjectInputText = createElement("input", { type: "text" });
  const saveProject = createElement("button", { type: "submit" });
  const closeAddProjectDialog = createElement(
    "button",
    { type: "button" },
    { margin: "10px 0 0 0" },
  );
  saveProject.innerText = "Save";
  closeAddProjectDialog.innerText = "Close";
  addProjectForm.append(addProjectLabel, addProjectInputText, saveProject);
  addProjectDialog.append(addProjectForm, closeAddProjectDialog);
  closeAddProjectDialog.addEventListener("click", () => {
    addProjectDialog.close();
  });
  saveProject.addEventListener("click", (event) => {
    event.preventDefault();
    let projectList = JSON.parse(localStorage.getItem("projects"));
    let projectName = addProjectInputText.value;
    if (projectList.includes(projectName) === false && projectName) {
      projectList.push(projectName);
      localStorage.setItem("projects", JSON.stringify(projectList));
    }
    closeAddProjectDialog.click();
  });
  return addProjectDialog;
}

function updateProjectList(selectedProject) {
  let projectList = JSON.parse(localStorage.getItem("projects"));
  projectList = projectList.filter((project) => project !== selectedProject);
  localStorage.setItem("projects", JSON.stringify(projectList));
}

function changeProjectToDefault(taskList, selectedProject) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].project !== selectedProject) continue;
    taskList[i].project = "-";
  }
}

function updateTaskList(userInput, selectedProject) {
  let incompletetaskList = getTasksFromLocalStorage("not-completed");
  let completetaskList = getTasksFromLocalStorage("completed");
  if (userInput) {
    changeProjectToDefault(incompletetaskList, selectedProject);
    changeProjectToDefault(completetaskList, selectedProject);
  } else {
    incompletetaskList = incompletetaskList.filter(
      (task) => task.project !== selectedProject,
    );
    completetaskList = incompletetaskList.filter(
      (task) => task.project !== selectedProject,
    );
  }
  localStorage.setItem("not-completed", JSON.stringify(incompletetaskList));
  localStorage.setItem("completed", JSON.stringify(completetaskList));
}

function createRemoveProjectDialog() {
  const removeProjectDialog = createElement("dialog");
  removeProjectDialog.id = "remove-project-dialog";
  const removeProjectForm = createElement("form", {
    id: "remove-project-form",
  });
  const selectProjectLabel = createElement("label");
  selectProjectLabel.innerText = "Select project :";
  const selectProject = createElement("select", { id: "remove-project" });
  const removeProject = createElement("button", { type: "submit" });
  removeProject.innerText = "Remove";
  const closeRemoveProjectDialog = createElement(
    "button",
    { type: "button" },
    { margin: "10px 0 0 0" },
  );
  closeRemoveProjectDialog.innerText = "Close";
  const p = createElement("p");
  p.innerText = "Keep Tasks?";
  const div1 = createElement("div");
  const yesInput = createElement("input", {
    type: "radio",
    id: "yes-button",
    name: "keep-tasks",
    value: "yes",
  });
  const yesLabel = createElement("label", { for: "yes" });
  yesLabel.innerText = "Yes";
  div1.append(yesInput, yesLabel);
  const div2 = createElement("div");
  const noInput = createElement("input", {
    type: "radio",
    id: "no-button",
    name: "keep-tasks",
    value: "no",
    checked: "true",
  });
  const noLabel = createElement("label", { for: "no" });
  noLabel.innerText = "No";
  div2.append(noInput, noLabel);
  removeProject.addEventListener("click", (event) => {
    event.preventDefault();
    let userInput;
    if (yesInput.checked) {
      userInput = true;
    } else {
      userInput = false;
    }
    updateTaskList(userInput, selectProject.value);
    updateProjectList(selectProject.value);
    closeRemoveProjectDialog.click();
    reloadTaskContainer();
  });
  closeRemoveProjectDialog.addEventListener("click", () => {
    removeProjectDialog.close();
  });
  removeProjectForm.append(
    selectProjectLabel,
    selectProject,
    p,
    div1,
    div2,
    removeProject,
  );
  removeProjectDialog.append(removeProjectForm, closeRemoveProjectDialog);
  return removeProjectDialog;
}

function projectsListener() {
  const projectsButton = document.querySelector("#show-projects");
  const addProjectDialog = createAddProjectDialog();
  const removeProjectDialog = createRemoveProjectDialog();
  projectsButton.addEventListener("mouseenter", () => {
    const addProjectButton = createHoverButton("Add Projects", "add-projects");
    const removeProjectButton = createHoverButton(
      "Remove Projects",
      "remove-projects",
    );
    const allProjectButton = createHoverButton("All Projects", "all-projects");
    addProjectButton.addEventListener("click", () => {
      addProjectDialog.showModal();
    });
    removeProjectButton.addEventListener("click", () => {
      createProjectOptions("#remove-project", 1);
      removeProjectDialog.showModal();
    });
    allProjectButton.addEventListener("click", () => {
      clearTasks();
      const taskContainer = document.querySelector("#task-container");
      let projectList = JSON.parse(localStorage.getItem("projects"));
      const projectDiv = createElement("div", { id: "project-container" });
      for (let i = 0; i < projectList.length; i++) {
        const project = createElement("button", {
          class: "project-button",
          id: `${projectList[i]}`,
        });
        if (i) project.innerText = projectList[i];
        else project.innerText = "Default";
        project.addEventListener("click", () => {
          let taskList = getTasksFromLocalStorage("not-completed").concat(
            getTasksFromLocalStorage("completed"),
          );
          taskList = taskList.filter((task) => task.project === project.id);
          renderTasksFromAList(taskList, true);
        });
        projectDiv.append(project);
      }
      taskContainer.append(projectDiv);
    });
    projectsButton.append(
      addProjectButton,
      removeProjectButton,
      allProjectButton,
    );
  });
  projectsButton.addEventListener("mouseleave", () => {
    const childButtons = document.querySelectorAll(".hover-button");
    childButtons.forEach((button) => {
      button.remove();
    });
  });
  projectsButton.append(addProjectDialog, removeProjectDialog);
}

function runMenuListeners() {
  todayButtonListener();
  allTasksListener();
  completedTasksListener();
  projectsListener();
  removeCompletedListener();
  toggleThemeListener();
}

export { runMenuListeners, filterTaskList, todayButtonListener };
