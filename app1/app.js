let kcalCount = 0;
function add(kcal) {
  kcalCount += kcal;
  kcalCountEl.innerText = kcalCount;
}

const kcalCountEl = document.getElementById("kcalCount");

function reset() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((cb) => (cb.checked = false));
  kcalCountEl.innerText = "0";
  kcalCount = 0;
}
