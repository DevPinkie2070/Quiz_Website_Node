// Fragen-Sets
const questions = [
    {
        question: 'Was ist die Hauptstadt von Deutschland?',
        answers: ["Berlin", "München", "Hamburg", "Köln"],
        correct: 0
    },
    {
        question: "Wie viele Kontinente gibt es?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Welche Automarke hat ein Pferd als Logo?",
        answers: ["Ferrari", "Ford", "Volkswagen", "Nissan"],
        correct: 0
    },
    {
        question: "Wie viele Bundesländer hat Deutschland?",
        answers: ["4", "19", "20", "16"],
        correct: 3
    },
];

const questions2 = [
    {
        question: 'Was ist die Hauptstadt von Deutschland?',
        answers: ["Berlin", "München", "Hamburg", "Köln"],
        correct: 0
    },
    {
        question: "Wie viele Kontinente gibt es?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Welche Automarke hat ein Pferd als Logo?",
        answers: ["Ferrari", "Ford", "Volkswagen", "Nissan"],
        correct: 0
    },
    {
        question: "Wie viele Bundesländer hat Deutschland?",
        answers: ["4", "19", "20", "16"],
        correct: 3
    },
    {
        question: "Wie viele Knochen hat ein Mensch?",
        answers: ["207", "206", "311", "261"],
        correct: 1
    },
    {
        question: "Was heißt IT?",
        answers: ["Informatik Technologie", "Informations Technologie", "Info Text"],
        correct: 1
    },
];

const questions3 = [
    {
        question: "Was ist die Dateiendung für C++?",
        answers: ["c", "c++", "cpp", "cpps"],
        correct: 2
    },
    {
        question: "Was davon ist keine Programmiersprache?",
        answers: ["Java", "Python", "HTML", "C#"],
        correct: 2
    },
    {
        question: "Welcher HTML Tag ist für eine große Überschrift?",
        answers: ["<p>", "<h1>", "<ul>", "<input>"],
        correct: 1
    },
    {
        question: "Was davon ist JavaScript?",
        answers: ["print()", "console.log()"],
        correct: 1
    },
    {
        question: "Was davon ist ein Frontend Framework?",
        answers: ["Angular", "node.js", "Webstorm", "mysql"],
        correct: 0,
    },
    {
        question: "Bedeutet VPN Virtual Private Network?",
        answers: ["Ja", "Nein"],
        correct: 0,
    },
    {
        question: "Was ist die Entwicklungsumgebung für IOS Apps?",
        answers: ["Visual Studio", "XCode", "IntelliJ", "PyCharm"],
        correct: 1,
    },
    {
        question: "Für was ist CSS?",
        answers: ["Für Website Logik", "Für Backend", "Zum Designen einer Website", "Zum Designen einer IOS App"],
        correct: 2
    },
    {
        question: "Auf welchem Betriebssystem laufen die meisten Server?",
        answers: ["Windows", "macOS", "Linux"],
        correct: 2,
    },
    {
        question: "Wie werden Passwörter in einer Datenbank gespeichert?",
        answers: ["Ganz normal wie sie sind", "als Hash"],
        correct: 1,
    },
    {
        question: "Welche Entwicklungsumgebung ist für Java?",
        answers: ["IntelliJ", "PyCharm", "Webstorm", "XCode"],
        correct: 0,
    },
];

// Globale Variablen
let currentQuestions = []; // Enthält das aktuell ausgewählte Fragen-Set
let currentQuestionIndex = 0;
let score = 0;

// Referenzen auf DOM-Elemente
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const nextButton = document.getElementById("next-button");
const scoreText = document.getElementById("score-text");

// Modi auswählen
function hideStart() {
    document.getElementById('start').style.display = 'none';
    //document.getElementById('modis').style.display = 'block';
    document.getElementById('password').style.display = 'block';
}

function startModi1() {
    document.getElementById('modis').style.display = 'none';
    currentQuestions = questions; // Setze das Fragen-Set für Modi 1
    startQuiz();
}

function startModi2() {
    document.getElementById('modis').style.display = 'none';
    currentQuestions = questions2; // Setze das Fragen-Set für Modi 2
    startQuiz();
}

function startModi3() {
    document.getElementById('modis').style.display = 'none';
    currentQuestions = questions3; // Setze das Fragen-Set für Modi 3
    startQuiz();
}

// Quiz starten
function startQuiz() {
    questionScreen.style.display = 'block';
    resultScreen.style.display = 'none';
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    // Styling des Containers für Zentrierung
    const answersContainer = document.getElementById("answers-container");
    answersContainer.style.display = "flex";
    answersContainer.style.flexDirection = "column";
    answersContainer.style.alignItems = "center";
    answersContainer.style.justifyContent = "center";
    answersContainer.style.height = "80%"; // Höhe des Containers setzen

    answersContainer.innerHTML = ""; // Vorherige Inhalte löschen

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("answer-button");

        // Styling für die Buttons
        button.style.display = "block";
        button.style.width = "50%"; // Breite der Buttons
        button.style.margin = "10px 0"; // Abstand zwischen Buttons
        button.style.padding = "10px"; // Größere Klickflächen

        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    nextButton.style.display = 'none';
}



// Antwort prüfen
function selectAnswer(selectedIndex) {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correct) {
        score++;
    }
    //nextButton.style.display = 'block';
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}


nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Ergebnisse anzeigen
function showResults() {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    scoreText.textContent = `Du hast ${score} von ${currentQuestions.length} Fragen richtig beantwortet.`;
}

// Quiz neu starten
document.getElementById("restart-button").addEventListener("click", () => {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    document.getElementById('modis').style.display = 'block';
});

function goToQuiz() {
    window.location('quiz.html');
};