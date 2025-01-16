let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizMode = ''; // Variable für den Quizmodus (quiz_1, quiz_2, quiz_3)

const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const nextButton = document.getElementById("next-button");
const scoreText = document.getElementById("score-text");

document.addEventListener("DOMContentLoaded", function () {
  loadQuestions();
});

// Funktion zum Laden der Fragen aus der JSON-Datei
function loadQuestions() {
  fetch('/get-questions')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Beispiel: Setze Quizmodus auf Quiz 1
      currentQuestions = data[1]; // Hier könnte auch ein Quizmodus übergeben werden
      quizMode = 'quiz_1';  // Quiz 1 festlegen
      startQuiz();
    })
    .catch((error) => console.error('Fehler beim Laden der Fragen:', error));
}

// Funktion zum Starten des Quiz
function startQuiz() {
  questionScreen.style.display = 'block';
  resultScreen.style.display = 'none';
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
}

// Funktion zum Laden der aktuellen Frage
function loadQuestion() {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = ''; // Container zurücksetzen
  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-button");

    button.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(button);
  });

  nextButton.style.display = 'none'; // "Nächste Frage"-Button ausblenden
}

// Funktion zur Auswahl einer Antwort
function selectAnswer(selectedIndex) {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  if (selectedIndex === currentQuestion.correct) {
    score++;
  }
  nextQuestion();
}

// Funktion zum Laden der nächsten Frage
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Funktion zum Anzeigen des Ergebnisses
function showResults() {
  questionScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  scoreText.textContent = `Du hast ${score} von ${currentQuestions.length} Fragen richtig beantwortet.`;

  // Sende den Highscore an den Server
  saveHighScore();
}

function saveHighScore(quizMode, score) {
    fetch('/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizMode: quizMode,  // 'quiz_1', 'quiz_2', oder 'quiz_3'
        score: score         // Der erreichte Highscore
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);  // Erfolgsmeldung
    })
    .catch(error => {
      console.error('Fehler beim Speichern des Highscores:', error);
    });
  }

document.getElementById("restart-button").addEventListener("click", () => {
  questionScreen.style.display = 'none';
  resultScreen.style.display = 'none';
  document.getElementById('modis').style.display = 'block';  // Oder ein anderes Menü
});