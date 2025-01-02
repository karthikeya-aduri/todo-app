import "./imports.js"
import { runDialogListeners } from "./dialog.js";
import { runMenuListeners } from "./menu.js";

function clickButton(query) {
    const button = document.querySelector(query);
    button.click();
}

function main() {
    runDialogListeners();
    runMenuListeners();
    clickButton("#show-today");
}

main();
