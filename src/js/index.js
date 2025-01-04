import "./imports.js"
import { runDialogListeners } from "./dialog.js";
import { runMenuListeners } from "./menu.js";
import { getGreeting } from "./greeting.js";
import { createElement } from "./render.js";

function clickButton(query) {
    const button = document.querySelector(query);
    button.click();
}

function getTheme() {
    let themeJSON = localStorage.getItem("theme");
    let theme;
    if (themeJSON === null) {
        theme = "light";
        localStorage.setItem("theme", JSON.stringify("light"));
    }
    else {
        theme = JSON.parse(themeJSON);
    }
    return theme;
}

function setDefaultProject() {
    const projects = localStorage.getItem("projects");
    if (projects === null) {
        let projectList = ['-'];
        localStorage.setItem("projects", JSON.stringify(projectList));
    }
}

function main() {
    setDefaultProject();
    runDialogListeners();
    runMenuListeners();
    getGreeting();
    const timeDelay = 3600000;
    setInterval(getGreeting, timeDelay);
    clickButton("#show-today");
    let theme = getTheme();
    if (theme === "dark") {
        const toggleThemeButton = document.querySelector('#toggle-theme');
        toggleThemeButton.click();
    }
}

main();
