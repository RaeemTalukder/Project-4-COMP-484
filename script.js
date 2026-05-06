
// DOM ELEMENTS

const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextElement = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

const wpmDisplay = document.querySelector("#wpm");
const errorDisplay = document.querySelector("#errors");
const leaderboardDisplay = document.querySelector("#leaderboard");
const darkToggle = document.querySelector("#dark-mode-toggle");

//text array to randomize (Uncle Iroh quotes)
const texts = [
    "In the darkest times, hope is something you give yourself. That is the meaning of inner strength.",
    "Sometimes life is like this dark tunnel. You can't always see the light at the end of the tunnel, but if you just keep moving... you will come to a better place.",
    "Even in the material world, you will find that if you look for the light, you can often find it. But if you look for the dark, that is all you will ever see.",
    "While it is always best to believe in oneself, a little help from others can be a great blessing.",
    "It is important to draw wisdom from many different places. If you take it from only one place, it becomes rigid and stale.",
    "Failure is only the opportunity to begin again, this time more intelligently.",
    "Pride is not the opposite of shame, but its source.",
    "True humility is the only antidote to shame.",
    "It's time for you to look inward and begin asking yourself the big question: who are you and what do you want?",
    "Sometimes, the best way to solve your own problems is to help someone else."
];


//variables
let timer = [0, 0, 0];
let interval = null;
let running = false;
let errors = 0;
let started = false;



//runs after page is loaded
window.onload = () => {
    setRandomText();
    loadLeaderboard();
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
};

//toggle dark mode
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

//random text
function setRandomText() {
    const random = Math.floor(Math.random() * texts.length);
    originTextElement.textContent = texts[random];
}


// timer
function runTimer() {
    let current = `${pad(timer[0])}:${pad(timer[1])}:${pad(timer[2])}`;
    theTimer.textContent = current;

    timer[2]++;
    if (timer[2] === 100) {
        timer[2] = 0;
        timer[1]++;
    }
    if (timer[1] === 60) {
        timer[1] = 0;
        timer[0]++;
    }
}

function pad(unit) {
    return unit < 10 ? "0" + unit : unit;
}

function startTimer() {
    if (!running) {
        interval = setInterval(runTimer, 10);
        running = true;
    }
}


//input check
testArea.addEventListener("input", () => {
    if (!started) {
        startTimer();
        started = true;
    }

    const origin = originTextElement.textContent;
    const input = testArea.value;

    validate(origin, input);
});


//double check if input and quote match, if does border redm if not border bluw

function validate(origin, input) {
    const compare = origin.substring(0, input.length);

    if (input === compare) {
        testWrapper.style.borderColor = "blue";
    } else {
        testWrapper.style.borderColor = "red";
        errors++;
    }

    errorDisplay.textContent = errors;
    //when everything matches, finish test
    if (input === origin) {
        finishTest();
    }
}



//finish test, clear interval, green border, store time and wpm
function finishTest() {
    clearInterval(interval);
    running = false;

    testWrapper.style.borderColor = "green";

    const totalSeconds = timer[0] * 60 + timer[1] + timer[2] / 100;
    const chars = testArea.value.length;

    const wpm = Math.round((chars / 5) / (totalSeconds / 60));
    wpmDisplay.textContent = wpm;

    saveScore(wpm);
}



//save scores and names
function saveScore(wpm) {
    let name = prompt("Enter your name:") || "Anonymous";
//convert timer to seconds for easier comparison and storage
    const totalSeconds = timer[0] * 60 + timer[1] + timer[2] / 100;
//get existing scores, add new score, sort and keep top 3
    let scores = JSON.parse(localStorage.getItem("typingScores")) || [];
//store name, wpm, time in seconds, and display time for leaderboard
    scores.push({
        name: name,
        wpm: wpm,
        time: totalSeconds, 
        displayTime: `${pad(timer[0])}:${pad(timer[1])}:${pad(timer[2])}`
    });

    //sort lowest scores
    scores.sort((a, b) => a.time - b.time);

    // keep top 3 fastest
    scores = scores.slice(0, 3);
// store back to localStorage
    localStorage.setItem("typingScores", JSON.stringify(scores));

    loadLeaderboard();
}

//print stored scores on the leaderboard
function loadLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("typingScores")) || [];

    leaderboardDisplay.innerHTML = "";
// display each score with rank, name, time, and wpm
    scores.forEach((s, i) => {
        leaderboardDisplay.innerHTML += `
            <li>
                #${i + 1} ${s.name} — ${s.displayTime} (${s.wpm} WPM)
            </li>
        `;
    });
}


resetButton.addEventListener("click", resetAll);
//.Start over 
function resetAll() {
    clearInterval(interval);

    timer = [0, 0, 0];
    running = false;
    started = false;
    errors = 0;

    testArea.value = "";
    theTimer.textContent = "00:00:00";
    errorDisplay.textContent = "0";
    wpmDisplay.textContent = "0";

    testWrapper.style.borderColor = "#ccc";

    setRandomText();
}