
/* ==========================================
   LinguaLearn — Language Learning App
   Complete script.js
   ========================================== */

"use strict";

/* ---------- LANGUAGE DATA ---------- */

const languages = {
  Spanish: {
    flag: "🇪🇸",
    subtitle: "Romance language",
    words: [
      { word: "Hola", meaning: "Hello", pronunciation: "OH-lah" },
      { word: "Gracias", meaning: "Thank you", pronunciation: "GRAH-see-ahs" },
      { word: "Amigo", meaning: "Friend", pronunciation: "ah-MEE-goh" },
      { word: "Agua", meaning: "Water", pronunciation: "AH-gwah" },
      { word: "Casa", meaning: "House", pronunciation: "KAH-sah" },
      { word: "Perro", meaning: "Dog", pronunciation: "PEH-rroh" },
      { word: "Gato", meaning: "Cat", pronunciation: "GAH-toh" },
      { word: "Libro", meaning: "Book", pronunciation: "LEE-broh" },
      { word: "Sol", meaning: "Sun", pronunciation: "sohl" },
      { word: "Amor", meaning: "Love", pronunciation: "ah-MOR" }
    ]
  },

  French: {
    flag: "🇫🇷",
    subtitle: "Language of art",
    words: [
      { word: "Bonjour", meaning: "Hello", pronunciation: "bohn-ZHOOR" },
      { word: "Merci", meaning: "Thank you", pronunciation: "mehr-SEE" },
      { word: "Ami", meaning: "Friend", pronunciation: "ah-MEE" },
      { word: "Eau", meaning: "Water", pronunciation: "oh" },
      { word: "Maison", meaning: "House", pronunciation: "meh-ZOHN" },
      { word: "Chien", meaning: "Dog", pronunciation: "shee-EHN" },
      { word: "Chat", meaning: "Cat", pronunciation: "shah" },
      { word: "Livre", meaning: "Book", pronunciation: "LEEVR" },
      { word: "Soleil", meaning: "Sun", pronunciation: "soh-LAY" },
      { word: "Amour", meaning: "Love", pronunciation: "ah-MOOR" }
    ]
  },

  Japanese: {
    flag: "🇯🇵",
    subtitle: "Language of discovery",
    words: [
      { word: "こんにちは", meaning: "Hello", pronunciation: "Konnichiwa" },
      { word: "ありがとう", meaning: "Thank you", pronunciation: "Arigatou" },
      { word: "友達", meaning: "Friend", pronunciation: "Tomodachi" },
      { word: "水", meaning: "Water", pronunciation: "Mizu" },
      { word: "家", meaning: "House", pronunciation: "Ie" },
      { word: "犬", meaning: "Dog", pronunciation: "Inu" },
      { word: "猫", meaning: "Cat", pronunciation: "Neko" },
      { word: "本", meaning: "Book", pronunciation: "Hon" },
      { word: "太陽", meaning: "Sun", pronunciation: "Taiyou" },
      { word: "愛", meaning: "Love", pronunciation: "Ai" }
    ]
  },

  German: {
    flag: "🇩🇪",
    subtitle: "Language of ideas",
    words: [
      { word: "Hallo", meaning: "Hello", pronunciation: "HAH-loh" },
      { word: "Danke", meaning: "Thank you", pronunciation: "DAHN-kuh" },
      { word: "Freund", meaning: "Friend", pronunciation: "froynt" },
      { word: "Wasser", meaning: "Water", pronunciation: "VAH-ser" },
      { word: "Haus", meaning: "House", pronunciation: "howss" },
      { word: "Hund", meaning: "Dog", pronunciation: "hoont" },
      { word: "Katze", meaning: "Cat", pronunciation: "KAHT-suh" },
      { word: "Buch", meaning: "Book", pronunciation: "bookh" },
      { word: "Sonne", meaning: "Sun", pronunciation: "ZON-uh" },
      { word: "Liebe", meaning: "Love", pronunciation: "LEE-buh" }
    ]
  },

  Italian: {
    flag: "🇮🇹",
    subtitle: "Language of culture",
    words: [
      { word: "Ciao", meaning: "Hello", pronunciation: "chow" },
      { word: "Grazie", meaning: "Thank you", pronunciation: "GRAHT-see-eh" },
      { word: "Amico", meaning: "Friend", pronunciation: "ah-MEE-koh" },
      { word: "Acqua", meaning: "Water", pronunciation: "AHK-kwah" },
      { word: "Casa", meaning: "House", pronunciation: "KAH-zah" },
      { word: "Cane", meaning: "Dog", pronunciation: "KAH-neh" },
      { word: "Gatto", meaning: "Cat", pronunciation: "GAHT-toh" },
      { word: "Libro", meaning: "Book", pronunciation: "LEE-broh" },
      { word: "Sole", meaning: "Sun", pronunciation: "SOH-leh" },
      { word: "Amore", meaning: "Love", pronunciation: "ah-MOH-reh" }
    ]
  },

  Telugu: {
    flag: "🇮🇳",
    subtitle: "A language of expression",
    words: [
      { word: "నమస్కారం", meaning: "Hello", pronunciation: "Namaskaaram" },
      { word: "ధన్యవాదాలు", meaning: "Thank you", pronunciation: "Dhanyavaadaalu" },
      { word: "స్నేహితుడు", meaning: "Friend", pronunciation: "Sneehithudu" },
      { word: "నీరు", meaning: "Water", pronunciation: "Neeru" },
      { word: "ఇల్లు", meaning: "House", pronunciation: "Illu" },
      { word: "కుక్క", meaning: "Dog", pronunciation: "Kukka" },
      { word: "పిల్లి", meaning: "Cat", pronunciation: "Pilli" },
      { word: "పుస్తకం", meaning: "Book", pronunciation: "Pusthakam" },
      { word: "సూర్యుడు", meaning: "Sun", pronunciation: "Sooryudu" },
      { word: "ప్రేమ", meaning: "Love", pronunciation: "Prema" }
    ]
  }
};


/* ---------- STORAGE ---------- */

const STORAGE_KEY = "lingualearn_forest_progress_v1";

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && typeof saved === "object") {
      return {
        learned: Array.isArray(saved.learned) ? saved.learned : [],
        bestScore: Number.isFinite(saved.bestScore)
          ? saved.bestScore
          : 0
      };
    }
  } catch (error) {
    console.warn("Could not load saved progress.", error);
  }

  return { learned: [], bestScore: 0 };
}

let progress = loadProgress();

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Could not save progress.", error);
  }
}


/* ---------- APP STATE ---------- */

const TOTAL_WORDS = Object.values(languages)
  .reduce((total, language) => total + language.words.length, 0);

let currentLanguage = "Spanish";
let currentWordIndex = 0;
let meaningVisible = false;

let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let selectedAnswer = null;
let answerChecked = false;
let quizFinished = false;


/* ---------- DOM HELPERS ---------- */

const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = String(value);
}

function showElement(element, visible) {
  if (element) element.hidden = !visible;
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}


/* ---------- LANGUAGE CATEGORIES ---------- */

function renderCategories() {
  const container = $("#categoriesGrid");
  if (!container) return;

  container.innerHTML = "";

  Object.entries(languages).forEach(([name, language]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-btn";
    button.dataset.language = name;
    button.setAttribute(
      "aria-pressed",
      String(name === currentLanguage)
    );

    if (name === currentLanguage) {
      button.classList.add("active");
    }

    const icon = document.createElement("span");
    icon.className = "category-icon";
    icon.textContent = language.flag;

    const info = document.createElement("span");
    info.className = "category-info";

    const title = document.createElement("strong");
    title.className = "category-name";
    title.textContent = name;

    const subtitle = document.createElement("small");
    subtitle.textContent = language.subtitle;

    const count = document.createElement("small");
    count.className = "category-count";
    count.textContent = `${language.words.length} vocabulary words`;

    info.append(title, subtitle, count);

    const arrow = document.createElement("span");
    arrow.className = "category-arrow";
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");

    button.append(icon, info, arrow);

    button.addEventListener("click", () => {
      selectLanguage(name);
    });

    container.appendChild(button);
  });
}

function selectLanguage(name) {
  if (!languages[name]) return;

  currentLanguage = name;
  currentWordIndex = 0;
  meaningVisible = false;

  renderCategories();
  renderFlashcard();
  updateDashboard();
}


/* ---------- FLASHCARDS ---------- */

function currentWord() {
  const words = languages[currentLanguage].words;
  return words[currentWordIndex];
}

function renderFlashcard() {
  const word = currentWord();
  if (!word) return;

  setText("#cardCategory", `${languages[currentLanguage].flag} ${currentLanguage}`);
  setText("#word", word.word);
  setText("#meaning", word.meaning);
  setText("#pronunciation", word.pronunciation);
  setText(
    "#cardCount",
    `${currentWordIndex + 1} / ${languages[currentLanguage].words.length}`
  );

  const meaningContainer = $("#meaningContainer");
  showElement(meaningContainer, meaningVisible);

  const flipButton = $("#flipBtn");

  if (flipButton) {
    flipButton.textContent = meaningVisible
      ? "Hide Meaning"
      : "Reveal Meaning";
  }

  const learnedButton = $("#learnedBtn");
  if (learnedButton) {
    const isLearned = isCurrentWordLearned();

    learnedButton.textContent = isLearned
      ? "✓ Learned — Click to Undo"
      : "✓ Mark as Learned";

    learnedButton.setAttribute("aria-pressed", String(isLearned));
  }

  const card = $("#flashcard");
  if (card) {
    card.classList.remove("card-enter");
    void card.offsetWidth;
    card.classList.add("card-enter");
  }
}

function wordKey(languageName, word) {
  return `${languageName}::${word.word}`;
}

function isCurrentWordLearned() {
  return progress.learned.includes(
    wordKey(currentLanguage, currentWord())
  );
}

function flipMeaning() {
  meaningVisible = !meaningVisible;
  renderFlashcard();
}

function moveWord(direction) {
  const words = languages[currentLanguage].words;

  currentWordIndex =
    (currentWordIndex + direction + words.length) % words.length;

  meaningVisible = false;
  renderFlashcard();
}

function toggleLearned() {
  const key = wordKey(currentLanguage, currentWord());
  const index = progress.learned.indexOf(key);

  if (index >= 0) {
    progress.learned.splice(index, 1);
  } else {
    progress.learned.push(key);
  }

  saveProgress();
  renderFlashcard();
  updateDashboard();
}


/* ---------- QUIZ GENERATION ---------- */

function buildQuizQuestions() {
  const allWords = [];

  Object.entries(languages).forEach(([languageName, language]) => {
    language.words.forEach((word) => {
      allWords.push({
        language: languageName,
        word: word.word,
        meaning: word.meaning
      });
    });
  });

  const chosenWords = shuffle(allWords).slice(0, 10);

  return chosenWords.map((item) => {
    const otherMeanings = shuffle(
      [...new Set(
        allWords
          .filter((candidate) => candidate.meaning !== item.meaning)
          .map((candidate) => candidate.meaning)
      )]
    ).slice(0, 3);

    const options = shuffle([
      item.meaning,
      ...otherMeanings
    ]);

    return {
      ...item,
      options,
      correctAnswer: item.meaning
    };
  });
}


/* ---------- QUIZ RENDERING ---------- */

function startQuiz() {
  quizQuestions = buildQuizQuestions();
  quizIndex = 0;
  quizScore = 0;
  selectedAnswer = null;
  answerChecked = false;
  quizFinished = false;

  showElement($("#quizResult"), false);
  showElement($("#question"), true);
  showElement($("#options"), true);
  showElement($("#checkBtn"), true);
  showElement($("#nextQuestionBtn"), false);
  showElement($("#feedback"), false);

  const quizProgressTrack = $("#quizProgressTrack");
  if (quizProgressTrack) {
    quizProgressTrack.setAttribute("aria-valuenow", "0");
  }

  renderQuestion();
}

function renderQuestion() {
  if (quizIndex >= quizQuestions.length) {
    finishQuiz();
    return;
  }

  const item = quizQuestions[quizIndex];

  selectedAnswer = null;
  answerChecked = false;

  setText(
    "#questionNumber",
    `Question ${quizIndex + 1} of ${quizQuestions.length}`
  );

  setText(
    "#question",
    `${languages[item.language].flag} ${item.word} (${item.language}) means...`
  );

  const optionsContainer = $("#options");

  if (optionsContainer) {
    optionsContainer.innerHTML = "";

    item.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.dataset.answer = option;
      button.setAttribute("aria-pressed", "false");

      const letter = document.createElement("span");
      letter.textContent = String.fromCharCode(65 + index);
      letter.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.textContent = option;

      button.append(letter, label);

      button.addEventListener("click", () => {
        chooseAnswer(option, button);
      });

      optionsContainer.appendChild(button);
    });
  }

  const percentage = (quizIndex / quizQuestions.length) * 100;

  const progressBar = $("#quizProgress");
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  const track = $("#quizProgressTrack");
  if (track) {
    track.setAttribute("aria-valuenow", String(Math.round(percentage)));
  }

  showElement($("#feedback"), false);
  showElement($("#checkBtn"), true);
  showElement($("#nextQuestionBtn"), false);

  const checkButton = $("#checkBtn");
  if (checkButton) {
    checkButton.disabled = false;
  }
}

function chooseAnswer(answer, button) {
  if (answerChecked || quizFinished) return;

  selectedAnswer = answer;

  document.querySelectorAll(".quiz-option").forEach((optionButton) => {
    optionButton.classList.remove("selected");
    optionButton.setAttribute("aria-pressed", "false");
  });

  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");
}

function checkAnswer() {
  if (answerChecked || quizFinished || selectedAnswer === null) {
    if (selectedAnswer === null && !quizFinished) {
      showFeedback("Choose an answer first! 🌱", true);
    }
    return;
  }

  answerChecked = true;

  const item = quizQuestions[quizIndex];
  const correct = selectedAnswer === item.correctAnswer;

  if (correct) {
    quizScore++;
    showFeedback("Correct! Great job! 🌟", false);
  } else {
    showFeedback(
      `Not quite! The correct answer is "${item.correctAnswer}".`,
      true
    );
  }

  document.querySelectorAll(".quiz-option").forEach((button) => {
    button.disabled = true;

    if (button.dataset.answer === item.correctAnswer) {
      button.classList.add("correct");
    } else if (button.dataset.answer === selectedAnswer) {
      button.classList.add("incorrect");
    }
  });

  showElement($("#checkBtn"), false);
  showElement($("#nextQuestionBtn"), true);

  const nextButton = $("#nextQuestionBtn");
  if (nextButton) {
    nextButton.textContent =
      quizIndex === quizQuestions.length - 1
        ? "See My Results →"
        : "Next Question →";
    nextButton.focus();
  }
}

function showFeedback(message, isError) {
  const feedback = $("#feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.toggle("error", isError);
  showElement(feedback, true);
}

function nextQuestion() {
  if (!answerChecked || quizFinished) return;

  quizIndex++;

  if (quizIndex >= quizQuestions.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

function finishQuiz() {
  quizFinished = true;

  const percentage = quizQuestions.length
    ? Math.round((quizScore / quizQuestions.length) * 100)
    : 0;

  progress.bestScore = Math.max(progress.bestScore, percentage);
  saveProgress();

  setText("#finalScore", `${quizScore} / ${quizQuestions.length}`);

  const progressBar = $("#quizProgress");
  if (progressBar) progressBar.style.width = "100%";

  const track = $("#quizProgressTrack");
  if (track) track.setAttribute("aria-valuenow", "100");

  showElement($("#question"), false);
  showElement($("#options"), false);
  showElement($("#feedback"), false);
  showElement($("#checkBtn"), false);
  showElement($("#nextQuestionBtn"), false);
  showElement($("#quizResult"), true);

  updateDashboard();
}


/* ---------- LEARNING DASHBOARD ---------- */

function updateDashboard() {
  const learnedCount = new Set(progress.learned).size;
  const percentage = TOTAL_WORDS
    ? Math.round((learnedCount / TOTAL_WORDS) * 100)
    : 0;

  setText("#totalWords", TOTAL_WORDS);
  setText("#completedWords", learnedCount);
  setText("#bestScore", `${progress.bestScore}%`);
  setText("#progressPercent", `${percentage}%`);
  setText("#progressLearned", learnedCount);
  setText("#progressTotal", TOTAL_WORDS);

  let level = "Beginner";

  if (percentage >= 75) {
    level = "Language Explorer";
  } else if (percentage >= 40) {
    level = "Forest Adventurer";
  } else if (percentage >= 15) {
    level = "Word Collector";
  }

  setText("#learningLevel", level);

  const summary = $("#progressSummary");
  if (summary) {
    summary.textContent =
      learnedCount === 0
        ? "Your adventure starts here. Learn your first word today!"
        : `Amazing! You've learned ${learnedCount} out of ${TOTAL_WORDS} words. Keep growing!`;
  }

  const ring = $("#progressCircle");
  if (ring) {
    ring.style.background =
      `conic-gradient(#4f9b59 ${percentage}%, #e7f0e2 ${percentage}%)`;
  }

  const bar = $("#overallProgressBar");
  if (bar) {
    bar.style.width = `${percentage}%`;
  }
}


/* ---------- RESET PROGRESS ---------- */

function resetProgress() {
  const confirmed = window.confirm(
    "Reset all learned words and your best quiz score?"
  );

  if (!confirmed) return;

  progress = {
    learned: [],
    bestScore: 0
  };

  saveProgress();
  renderFlashcard();
  updateDashboard();
}


/* ---------- OPTIONAL WORD ANIMATION ---------- */

function addFlashcardAnimationStyle() {
  if ($("#flashcard-animation-style")) return;

  const style = document.createElement("style");
  style.id = "flashcard-animation-style";

  style.textContent = `
    .card-enter {
      animation: forestCardEnter 280ms ease-out;
    }

    @keyframes forestCardEnter {
      from {
        opacity: 0.65;
        transform: translateY(7px) scale(0.99);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .card-enter {
        animation: none;
      }
    }
  `;

  document.head.appendChild(style);
}


/* ---------- EVENT LISTENERS ---------- */

function initializeApp() {
  renderCategories();
  renderFlashcard();
  updateDashboard();
  addFlashcardAnimationStyle();
  startQuiz();

  $("#flipBtn")?.addEventListener("click", flipMeaning);
  $("#prevBtn")?.addEventListener("click", () => moveWord(-1));
  $("#nextBtn")?.addEventListener("click", () => moveWord(1));
  $("#learnedBtn")?.addEventListener("click", toggleLearned);

  $("#checkBtn")?.addEventListener("click", checkAnswer);
  $("#nextQuestionBtn")?.addEventListener("click", nextQuestion);
  $("#restartBtn")?.addEventListener("click", startQuiz);

  $("#resetProgressBtn")?.addEventListener("click", resetProgress);

  // Keyboard navigation for vocabulary cards.
  document.addEventListener("keydown", (event) => {
    const tag = event.target?.tagName;

    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(tag) ||
      event.target?.isContentEditable
    ) {
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === "ArrowLeft") {
      moveWord(-1);
    } else if (event.key === "ArrowRight") {
      moveWord(1);
    }
  });
}


/* ---------- START APP ---------- */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
