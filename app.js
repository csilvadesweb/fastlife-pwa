let startTime = localStorage.getItem("startTime");
let duration = localStorage.getItem("duration") || 16 * 3600;
let interval;
let water = Number(localStorage.getItem("water")) || 0;
let waterHistory = JSON.parse(localStorage.getItem("waterHistory")) || [];
let fastsDone = Number(localStorage.getItem("fastsDone")) || 0;

const timerEl = document.getElementById("timer");
const progress = document.getElementById("progress");
const statusEl = document.getElementById("status");
const waterEl = document.getElementById("waterCount");
const dashStatus = document.getElementById("dashStatus");

waterEl.textContent = water;
document.getElementById("fastsDone").textContent = fastsDone;

document.getElementById("protocol").onchange = e => {
  duration = e.target.value * 3600;
  localStorage.setItem("duration", duration);
};

document.getElementById("start").onclick = () => {
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
  statusEl.textContent = "Jejum em andamento";
  dashStatus.textContent = "Ativo";
  runTimer();
};

document.getElementById("stop").onclick = () => {
  clearInterval(interval);
  progress.style.strokeDashoffset = 660;
  statusEl.textContent = "Jejum finalizado 🎉";
  dashStatus.textContent = "Concluído";
  fastsDone++;
  localStorage.setItem("fastsDone", fastsDone);
  localStorage.removeItem("startTime");
};

document.getElementById("addWater").onclick = () => {
  water++;
  waterHistory.push(Date.now());
  saveWater();
};

document.getElementById("undoWater").onclick = () => {
  if (water > 0) {
    water--;
    waterHistory.pop();
    saveWater();
  }
};

function saveWater() {
  waterEl.textContent = water;
  localStorage.setItem("water", water);
  localStorage.setItem("waterHistory", JSON.stringify(waterHistory));
}

function runTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      clearInterval(interval);
      statusEl.textContent = "Jejum concluído 🎉";
      dashStatus.textContent = "Concluído";
      return;
    }

    const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
    const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
    const s = String(remaining % 60).padStart(2, "0");
    timerEl.textContent = `${h}:${m}:${s}`;

    progress.style.strokeDashoffset = 660 - (elapsed / duration) * 660;
  }, 1000);
}

if (startTime) {
  statusEl.textContent = "Jejum em andamento";
  dashStatus.textContent = "Ativo";
  runTimer();
}

// Dark mode
const toggleTheme = document.getElementById("toggleTheme");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// Notificação simples
if ("Notification" in window) {
  Notification.requestPermission();
}