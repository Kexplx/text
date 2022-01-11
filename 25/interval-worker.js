/**
 * We need to start and stop the interval from a web worker
 * because chrome delays/stops the interval if the tab has no focus
 * if they were started from the page's main thread.
 */
let interval;

onmessage = ({ data: action }) => {
  switch (action) {
    case "start":
      interval = setInterval(() => postMessage(null), 1000);
      break;
    case "stop":
      clearInterval(interval);
      break;
    default:
      console.error(`Received invalid action: "${action}".`);
      break;
  }
};
