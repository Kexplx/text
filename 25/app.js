const intervalWorker = new Worker("interval-worker.js");

// It's necessary to load the audio file here while the tab is active
// because chrome blocks resource downloads from inactive tabs.
const endSound = new Audio("sounds/end.mp3");

document.onkeydown = (e) => {
  const isSpace = e.code === "Space";

  if (isSpace) {
    const isPlaying = playButton.style.display == "none";

    if (secondsLeft === 0) {
      return;
    } else if (isPlaying) {
      // We are playing, so we pause.
      pause();
    } else {
      // We are paused, so we resume.
      play();
    }
  }
};

const playButton = document.getElementById("btnPlay");
const pauseButton = document.getElementById("btnPause");
const resetButton = document.getElementById("btnReset");

playButton.onclick = play;
pauseButton.onclick = pause;
resetButton.onclick = reset;

const timerElement = document.getElementById("time");

const TOTAL_MINUTES = getTotalMinutesFromUrl();
setInitialMinutesInPage();
const TOTAL_SECONDS = TOTAL_MINUTES * 60;
let secondsLeft = TOTAL_SECONDS;

function play() {
  if (secondsLeft === TOTAL_SECONDS) {
    secondsLeft -= 1;
    updateTimer();
  }

  startInterval(() => {
    secondsLeft -= 1;
    updateTimer();

    if (secondsLeft === 0) {
      stopInterval();
      hide(pauseButton);
      hide(playButton);
      endSound.play();
    }
  });

  hide(playButton);
  show(pauseButton);
}

function pause() {
  stopInterval();

  hide(pauseButton);
  show(playButton);
}

function reset() {
  stopInterval();

  secondsLeft = TOTAL_SECONDS;
  updateTimer();

  hide(pauseButton);
  show(playButton);
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

function startInterval(cb) {
  intervalWorker.postMessage("start");

  intervalWorker.onmessage = cb;
}

function stopInterval() {
  intervalWorker.postMessage("stop");
}

function hide(el) {
  el.style.display = "none";
}

function show(el) {
  el.style.display = "";
}

function getTotalMinutesFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const minutesQuery = params.get("m");

  if (minutesQuery) {
    return Number(minutesQuery);
  } else {
    return 25;
  }
}

function setInitialMinutesInPage() {
  timerElement.innerText = `${addPadding(TOTAL_MINUTES)}:00`;
  document.title = `${TOTAL_MINUTES} Minutes`;
}
