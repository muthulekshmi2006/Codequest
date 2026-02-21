function openDoorAndGo(nextPage) {
    const door = document.querySelector(".door");
    door.classList.add("open");

    setTimeout(() => {
        window.location.href = nextPage;
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    if (username !== "" && password !== "") {
        openDoorAndGo("language.html");
    } else {
        error.innerText = "Please enter both Username and Password!";
    }
}
/* ===== MULTI LEVEL GAME ===== */

let level = 1;
let score = 30;
let chances = 3;
let time = 0;
let attempts = 0;
let timerInterval;

const questions = {
    1: {
        type: "output",
        question: `x = 5
print(x)`,
        answer: "5",
        hint: "It prints the value stored in x."
    },
    2: {
        type: "mcq",
        question: "Which keyword is used to display output in Python?",
        options: ["echo", "print", "show"],
        answer: "print",
        hint: "It starts with 'p'."
    },
    3: {
        type: "code",
        question: "Write a Python code to print Hello",
        answer: `print("Hello")`,
        hint: "Use print() function."
    }
};

window.onload = function () {
    if (document.getElementById("questionArea")) {
        loadLevel();
        startTimer();
    }
};

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("timer").innerText = time;
    }, 1000);
}

function loadLevel() {
    const q = questions[level];
    const area = document.getElementById("questionArea");

    document.getElementById("levelTitle").innerText = "🎮 Level " + level;
    document.getElementById("hint").style.display = "none";
    document.getElementById("message").innerText = "";
    chances = 3;
    document.getElementById("chances").innerText = chances;

    if (q.type === "output") {
        area.innerHTML = `
        <p>Predict the output:</p>
        <pre>${q.question}</pre>
        <input type="text" id="userAnswer">
        `;
    }

    if (q.type === "mcq") {
        area.innerHTML = `
        <p>${q.question}</p>
        ${q.options.map(opt => `
            <label>
                <input type="radio" name="mcq" value="${opt}"> ${opt}
            </label><br>
        `).join("")}
        `;
    }

    if (q.type === "code") {
        area.innerHTML = `
        <p>${q.question}</p>
        <textarea id="userAnswer" rows="3" style="width:80%;"></textarea>
        `;
    }
}

function submitAnswer() {
    const q = questions[level];
    let userAnswer;

    if (q.type === "mcq") {
        const selected = document.querySelector('input[name="mcq"]:checked');
        userAnswer = selected ? selected.value : "";
    } else {
        userAnswer = document.getElementById("userAnswer").value.trim();
    }

    attempts++;

    if (userAnswer === q.answer) {
        document.getElementById("message").innerHTML = "✅ Correct! Door Opening...";
        setTimeout(() => {
            openDoorAndNextLevel();
        }, 1500);
    } else {
        score -= 2;
        chances--;

        document.getElementById("score").innerText = score;
        document.getElementById("chances").innerText = chances;

        if (chances === 0) {
            clearInterval(timerInterval);
            localStorage.setItem("finalScore", score);
            localStorage.setItem("finalTime", time);
            localStorage.setItem("progress", "Poor");
            window.location.href = "result.html";
        } else {
            document.getElementById("message").innerHTML = "❌ Wrong! Try Again.";
        }
    }
}

function openDoorAndNextLevel() {
    const door = document.querySelector(".door");
    door.classList.add("open");

    setTimeout(() => {
        door.classList.remove("open");
        level++;

        if (level > 3) {
            clearInterval(timerInterval);
            calculateProgress();
            window.location.href = "result.html";
        } else {
            loadLevel();
        }
    }, 1500);
}

function showHint() {
    document.getElementById("hint").innerText = questions[level].hint;
    document.getElementById("hint").style.display = "block";
}

function calculateProgress() {
    let progress = "Good";

    if (score >= 26 && attempts <= 3 && time < 30) {
        progress = "Smart";
    } else if (score < 20) {
        progress = "Poor";
    }

    localStorage.setItem("finalScore", score);
    localStorage.setItem("finalTime", time);
    localStorage.setItem("progress", progress);
}