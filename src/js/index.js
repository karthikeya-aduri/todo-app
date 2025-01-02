import "./imports.js"
import { runDialogListeners } from "./dialog.js";
import { runMenuListeners } from "./menu.js";
import { getGreeting } from "./greeting.js";

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

function main() {
    runDialogListeners();
    runMenuListeners();
    getGreeting();
    clickButton("#show-today");
    let theme = getTheme();
    console.log(theme);
    if (theme === "dark") {
        const toggleThemeButton = document.querySelector('#toggle-theme');
        toggleThemeButton.click();
    }
}

main();
