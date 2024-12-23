import { format } from "date-fns";

function clearForm(form) {
    form.reset();
}

function renderTasksForToday(taskList) {
    let todayList = getTasksForToday(taskList);
    for (let i in todayList) {
        console.log(i, taskList[i]);
    }
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

export { clearForm, renderTasksForToday }
