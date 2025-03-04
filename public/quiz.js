const questions1 = [
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    answers: ["Samsung", "Apple", "Microsoft", "Google"],
    correct: 1
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    answers: ["Adobe", "SVG", "CSS", "HTML"],
    correct: 2
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.svg",
    answers: ["Firefox", "Google Chrome", "Edge", "Safari"],
    correct: 1
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Mozilla_Firefox_logo_2017.svg",
    answers: ["Edge", "Opera", "Arc", "Firefox"],
    correct: 3
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    answers: ["Git", "HTML", "Google", "Github"],
    correct: 3
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    answers: ["CSS", "PHP", "HTML", "JAVA"],
    correct: 2
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    answers: ["BMW", "Audi", "Mercedes", "Volkswagen"],
    correct: 0
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Audi_logo.svg",
    answers: ["BMW", "Audi", "Mercedes", "Volkswagen"],
    correct: 1
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Volkswagen_logo_2019.svg",
    answers: ["Volkswagen", "BMW", "Audi", "Mercedes"],
    correct: 0
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Ferrari-Logo.svg",
    answers: ["Ferrari", "Lamborghini", "Porsche", "Maserati"],
    correct: 0
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    answers: ["BMW", "Audi", "Volkswagen", "Mercedes"],
    correct: 3
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Porsche_Logo.svg",
    answers: ["Maserati", "Ferrari", "Lamborghini", "Porsche"],
    correct: 3
  },
  {
    question: "Welches Logo ist das?",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.svg",
    answers: ["Toyota", "Honda", "Nissan", "Mazda"],
    correct: 0
  }
];

const questions2 = [
    {
        question: "Was ist die Hauptstadt von Deutschland?",
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
        answers: ["Informatiktechnologie", "Informationstechnologie", "Info Text"],
        correct: 1
    },
    {
        question: "Wie viele Ozeane gibt es?",
        answers: ["2", "10", "5", "7"],
        correct: 2
    },
    {
        question: "Wann hat der erste Weltkrieg begonnen?",
        answers: ["1914", "1899", "1916", "1970"],
        correct: 0
    },
    {
        question: "Welches Land hat die meisten Nachbarländer?",
        answers: ["Russland", "Deutschland", "Frankreich", "China"],
        correct: 3
    },
    {
        question: "Wer war der erste Präsident der Vereinigten Staaten?",
        answers: ["George Washington", "Thomas Jefferson", "James Madison", "Andrew Jackson"],
        correct: 0
    },
    {
        question: "Wann wurde der Euro eingeführt?",
        answers: ["1980", "2002", "2000", "2010"],
        correct: 1
    },
    {
        question: "Was ist die Hauptstadt von Brasilien?",
        answers: ["Brasilia", "Sao Paulo", "Porto Algere", "Rio de Janeiro"],
        correct: 0
    },
    {
        question: "Wie viele Spieler hat ein Fußball Team auf dem Feld?",
        answers: ["14", "12", "11", "10"],
        correct: 2
    },
    {
        question: "Welche Farbe hat der Hut von Super Mario?",
        answers: ["Gelb", "Rot", "Grün", "Blau"],
        correct: 1
    },
    {
        question: "Was ist die Hauptstadt von Australien?",
        answers: ["Sydney", "Brasilia", "Melbourne", "Canberra"],
        correct: 3
    }
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
        correct: 0
    },
    {
        question: "Bedeutet VPN Virtual Private Network?",
        answers: ["Ja", "Nein"],
        correct: 0
    },
    {
        question: "Was ist die Entwicklungsumgebung für IOS Apps?",
        answers: ["Visual Studio", "XCode", "IntelliJ", "PyCharm"],
        correct: 1
    },
    {
        question: "Für was ist CSS?",
        answers: ["Für Website Logik", "Für Backend", "Zum Designen einer Website", "Zum Designen einer IOS App"],
        correct: 2
    },
    {
        question: "Auf welchem Betriebssystem laufen die meisten Server?",
        answers: ["Windows", "macOS", "Linux"],
        correct: 2
    },
    {
        question: "Wie werden Passwörter in einer Datenbank gespeichert?",
        answers: ["Ganz normal wie sie sind", "als Hash"],
        correct: 1
    },
    {
        question: "Welche Entwicklungsumgebung ist für Java?",
        answers: ["IntelliJ", "PyCharm", "Webstorm", "XCode"],
        correct: 0
    }
];

document.addEventListener("DOMContentLoaded", function () {
  fetch('/user-data')
    .then(response => {
      if (!response.ok) throw new Error('Not logged in');
      return response.json();
    })
    .then(data => {
      document.getElementById('username-display').textContent = data.username;
      const localHighScores = JSON.parse(localStorage.getItem('highScores')) || {};
      for (let quiz of ['quiz_1', 'quiz_2', 'quiz_3']) {
        const highscore = data.highscores[quiz] || localHighScores[quiz] || 0;
        document.getElementById(`${quiz}-score`).textContent = `${highscore}`;
      }
    })
    .catch(error => {
      showError('Bitte loggen Sie sich ein, um das Quiz zu starten.');
      setTimeout(() => {
        window.location.href = '/';
    }, 3000);
    });
});

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizMode = '';

function hideStart() {
  document.getElementById('start').style.display = 'none';
  document.getElementById('modis').style.display = 'flex';
  document.getElementById('logout').style.display = 'flex';
}

function startModi(modus) {
  document.getElementById('modis').style.display = 'none';
  quizMode = modus;
  currentQuestions = modus === 'quiz_1' ? questions1 : modus === 'quiz_2' ? questions2 : questions3;
  startQuiz();
}

function startQuiz() {
  document.getElementById("question-screen").style.display = 'block';
  document.getElementById("result-screen").style.display = 'none';
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  document.getElementById("question-text").textContent = currentQuestion.question;

  // Bild anzeigen, wenn vorhanden
  const questionImage = document.getElementById("question-image");
  if (currentQuestion.image) {
    questionImage.src = currentQuestion.image;
    questionImage.style.display = 'block';
  } else {
    questionImage.style.display = 'none';
  }

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-button");
    button.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const answerButtons = document.querySelectorAll('.answer-button');

  if (selectedIndex === currentQuestion.correct) {
    score++;
  }

  answerButtons.forEach((button, index) => {
    if (index === currentQuestion.correct) button.classList.add('correct');
    else if (index === selectedIndex) button.classList.add('incorrect');
    button.disabled = true;
  });

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) loadQuestion();
    else showResults();
  }, 2000);
}

function showResults() {
  document.getElementById("question-screen").style.display = 'none';
  document.getElementById("result-screen").style.display = 'block';
  document.getElementById("score-text").textContent = `Du hast ${score} von ${currentQuestions.length} Fragen richtig beantwortet.`;
  saveHighScore();
}

function saveHighScore() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || {};
  highScores[quizMode] = Math.max(highScores[quizMode] || 0, score);
  localStorage.setItem('highScores', JSON.stringify(highScores));

  fetch('/save-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizMode, score }),
  }).catch(() => showError('Fehler beim Speichern des Highscores.'));
}

function restartQuiz() {
  document.getElementById("result-screen").style.display = 'none';
  document.getElementById('modis').style.display = 'block';
}

function showError(message) {
  const errorBox = document.createElement('div');
  errorBox.className = 'error-box';
  errorBox.textContent = message;
  document.body.appendChild(errorBox);
  setTimeout(() => errorBox.remove(), 3000);
}

function logout() {
  toNextSide('/logout');
}

function toNextSide(url) {
  window.location.href = url;
}
