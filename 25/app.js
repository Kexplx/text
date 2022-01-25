const intervalWorker = new Worker("interval-worker.js");

// It's necessary to load the audio file here while the tab is active
// because chrome blocks resource downloads from inactive tabs.
const endSound = new Audio("sounds/end.mp3");

document.onkeydown = (e) => {
  const isSpace = e.code === "Space";

  if (isSpace) {
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

const playPauseButton = document.getElementById("btnPlayPause");
const resetButton = document.getElementById("btnReset");

playPauseButton.onclick = playOrPause;
resetButton.onclick = reset;

const timerElement = document.getElementById("time");

const TOTAL_MINUTES = getTotalMinutesFromUrl();
setInitialMinutesInPage();
const TOTAL_SECONDS = TOTAL_MINUTES * 60;
let secondsLeft = TOTAL_SECONDS;
let isPlaying = false;

function playOrPause() {
  playPauseButton.blur();
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function play() {
  isPlaying = true;
  if (secondsLeft === TOTAL_SECONDS) {
    secondsLeft -= 1;
    updateTimer();
  }

  startInterval(() => {
    secondsLeft -= 1;
    updateTimer();

    if (secondsLeft === 0) {
      stopInterval();
      togglePlayPauseIcon();

      endSound.play();
    }
  });

  togglePlayPauseIcon();
}

function pause() {
  isPlaying = false;
  stopInterval();

  togglePlayPauseIcon();
}

function reset() {
  stopInterval();

  secondsLeft = TOTAL_SECONDS;
  updateTimer();

  togglePlayPauseIcon();
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

function togglePlayPauseIcon() {
  const imageElInButton = playPauseButton.children.item(0).children.item(0);
  if (isPlaying) {
    // We are playing so we show the "pause" icon.
    imageElInButton.setAttribute("src", "icons/pause.svg");
  } else {
    imageElInButton.setAttribute("src", "icons/play.svg");
  }
}

function stopInterval() {
  intervalWorker.postMessage("stop");
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
