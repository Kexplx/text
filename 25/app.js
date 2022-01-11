document.addEventListener("keydown", (e) => {
  const isSpace = e.code === "Space";

  if (isSpace) {
    if (secondsLeft === 0) {
      return;
    } else if (playButton.disabled) {
      // We are playing, so we pause.
      pause();
    } else if (pauseButton.disabled) {
      // We are paused, so we resume.
      play();
    }
  }
});

const playButton = document.getElementById("btnPlay");
const pauseButton = document.getElementById("btnPause");
const resetButton = document.getElementById("btnReset");

playButton.onclick = play;
pauseButton.onclick = pause;
resetButton.onclick = reset;

const timerElement = document.getElementById("time");

const TOTAL_SECONDS = 25 * 60;
let secondsLeft = TOTAL_SECONDS;

let interval;

function play() {
  if (secondsLeft === TOTAL_SECONDS) {
    secondsLeft -= 1;
    updateTimer();
  }

  interval = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();

    if (secondsLeft === 0) {
      clearInterval(interval);
      pauseButton.disabled = true;
      new Audio("sounds/end.mp3").play();
    }
  }, 1000);

  pauseButton.disabled = false;
  playButton.disabled = true;
}

function pause() {
  clearInterval(interval);

  pauseButton.disabled = true;
  playButton.disabled = false;
}

function reset() {
  if (interval) {
    clearInterval(interval);
  }

  secondsLeft = TOTAL_SECONDS;
  updateTimer();

  pauseButton.disabled = true;
  playButton.disabled = false;
}

// Utils
function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const newTimerValue = `${addPadding(minutes)}:${addPadding(seconds)}`;
  timerElement.innerText = newTimerValue;
}

function addPadding(val) {
  if (val.toString().length === 1) {
    return `0${val}`;
  } else {
    return val;
  }
}
