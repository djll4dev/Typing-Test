let words = [
  "umbrella",
  "violin",
  "window",
  "xylophone",
  "yarn",
  "zebra",
  "bottle",
  "candle",
  "door",
  "engine",
  "forest",
  "glove",
  "hat",
  "ink",
  "jelly",
  "key",
  "lemon",
  "moon",
  "nest",
  "ocean",
  "plant",
  "quilt",
  "rose",
  "sun",
  "tree",
  "vase",
  "whale",
  "yard",
  "zoo",
  "grow",
];

// Set Levels
let lvls = {
  Easy: 5,
  Normal: 3,
  Hard: 2,
};
// Local Storage Object
let data = {};

let defaultLevel = "Normal";

// Level & Timing & Controlling Elements
let levelElement = document.getElementById("cur-level");
let messageSeconds = document.getElementById("seconds");
let timerSeconds = document.getElementById("time");
let startBtn = document.getElementById("start");
let currentWord = document.getElementById("current-word");
let typingInput = document.getElementById("typing-input");
let upcomingWords = document.getElementById("upcoming-words");
let selectList = document.getElementById("word-count");
let score = document.getElementById("score");
let resultElement = document.getElementById("result");
let restartBtn = document.getElementById("restart");

// Load Values
window.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("player-data")) {
    importFromLocalStorage();
    let data = JSON.parse(localStorage.getItem("player-data"));
    if (data["wordCount"]) {
      selectList.value = data["wordCount"];
    }
  } else {
    setLevelAndTimeValues(defaultLevel);
  }
});

// Functionality For Choosing Level ul
levelElement.addEventListener("click", function () {
  let levelsUl = this.nextElementSibling;
  levelsUl.style.display = "flex";
  [...levelsUl.children].forEach((level) => {
    level.addEventListener("click", function () {
      setLevelAndTimeValues(this.dataset.level);
      saveToLocalStorage("level", this.dataset.level);
      this.parentElement.style.display = "none";
    });
  });
});

// Set Word Count To Select List
let count = 5;
for (let i = count; i <= words.length; i += count) {
  let selectOption = document.createElement("option");
  selectOption.setAttribute("value", i);
  selectOption.append(i);
  selectList.append(selectOption);
}

// Save Word Count To Local Storage If Changed
selectList.addEventListener("input", function () {
  saveToLocalStorage("wordCount", this.value);
  displayWords(this.value);
  if (resultElement.textContent === "") {
    restartGame();
  }
});

// Start Playing
let hasStarted = false;
typingInput.addEventListener("input", function () {
  if (!hasStarted) {
    startPlaying();
    hasStarted = true;
  }
});
typingInput.addEventListener("paste", function () {
  return false;
});

// Restart Game
restartBtn.addEventListener("click", restartGame);

// ####### Functions ####### //
// Setting Message (Level & Seconds => Related To Level) Values To Elements

function setLevelAndTimeValues(level) {
  levelElement.innerHTML = level;
  messageSeconds.innerHTML = lvls[level];
  timerSeconds.innerHTML = lvls[level];
}

function saveToLocalStorage(key, value) {
  if (localStorage.getItem("player-data")) {
    data = JSON.parse(localStorage.getItem("player-data"));
  }
  data[key] = value;
  localStorage.setItem("player-data", JSON.stringify(data));
}

function importFromLocalStorage() {
  let data = JSON.parse(localStorage.getItem("player-data"));
  setLevelAndTimeValues(data["level"]);
  displayWords(data["wordCount"]);
}

function displayWords(wordCount) {
  upcomingWords.innerHTML = "";
  let wordsCopy = words.join(" ").split(" ");
  for (let i = 0; i < wordCount; i++) {
    let word = wordsCopy
      .splice(Math.floor(Math.random() * wordsCopy.length), 1)
      .join("");
    // Show The First Word In Current Word Element
    if (i === 0) {
      currentWord.textContent = word;
    }
    // Create Upcoming Word Element And Append It
    let comingWordElement = document.createElement("span");
    comingWordElement.append(word);
    upcomingWords.append(comingWordElement);
  }
}
let typingCounter;
function startPlaying() {
  let counting = 0;
  let nextWords = [...upcomingWords.children];
  typingCounter = setInterval(() => {
    if (nextWords.length) {
      // Update Written Value
      let hasWritten =
        typingInput.value === nextWords[0].textContent ? true : false;
      if (+timerSeconds.textContent) {
        if (hasWritten) {
          // Show Next Word
          nextWords.splice(0, 1);
          upcomingWords.children[0].remove();
          if (nextWords.length) {
            currentWord.textContent = nextWords[0].textContent;
          }
          // Reset Typing Input Value
          typingInput.value = "";
          // Count The Word
          ++score.textContent;
          // Reset Timer
          timerSeconds.textContent = messageSeconds.textContent;
        }
        ++counting;
        if (counting === 2) {
          --timerSeconds.textContent;
          counting = 0;
        }
      } else {
        gameResult("bad");
        clearInterval(typingCounter);
      }
    } else {
      gameResult("good");
      clearInterval(typingCounter);
    }
  }, 500);
}

function gameResult(result) {
  typingInput.setAttribute("disabled", "true");
  resultElement.style.display = "block";
  resultElement.classList.add(result);
  resultElement.append(result.length - 3 ? "Good Job!" : "Game Over!");
}

function restartGame() {
  hasStarted = false;
  clearInterval(typingCounter);
  typingInput.value = "";
  timerSeconds.textContent = lvls[levelElement.textContent];
  displayWords(selectList.value);
  if (resultElement.textContent) {
    typingInput.removeAttribute("disabled");
    resultElement.style.display = "none";
    resultElement.textContent = "";
  }
}
