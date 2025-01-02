import { getHours } from "date-fns";

function getGreeting() {
    const hoursPassed = getHours(Date());
    const heading = document.querySelector('#greeting>h1');
    if (hoursPassed < 12)
        heading.innerText = 'Good morning!';
    else if (hoursPassed > 11 && hoursPassed < 18)
        heading.innerText = 'Good afternoon!';
    else
        heading.innerText = 'Good evening!';
}

export { getGreeting };
