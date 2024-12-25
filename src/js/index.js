import "./imports.js"
import { runDialogListeners } from "./dialog.js";
import { runMenuListeners, todayButtonListener } from "./menu.js";

function main() {
    runDialogListeners();
    runMenuListeners();
    const today = document.querySelector('#show-today');
    today.click();
}

main();
