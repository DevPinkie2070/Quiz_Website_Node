let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';

const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const nextButton = document.getElementById("next-button");
const scoreText = document.getElementById("score-text");

document.addEventListener("DOMContentLoaded", function () {
    loadQuestions();
});

function loadQuestions() {
    fetch('/get-questions')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentQuestions = data[1];
            quizMode = 'quiz_1';
            startQuiz();
        })
        .catch((error) => console.error('Fehler beim Laden der Fragen:', error));
}

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

    answersContainer.innerHTML = '';
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("answer-button");

        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    nextButton.style.display = 'none';
}

function selectAnswer(selectedIndex) {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correct) {
        score++;
    }
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

function showResults() {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    scoreText.textContent = `Du hast ${score} von ${currentQuestions.length} Fragen richtig beantwortet.`;

    saveHighScore();
}

function saveHighScore(quizMode, score) {
    fetch('/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quizMode: quizMode,
            score: score
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Fehler beim Speichern des Highscores:', error);
    });
}

document.getElementById("restart-button").addEventListener("click", () => {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    document.getElementById('modis').style.display = 'block';
});
