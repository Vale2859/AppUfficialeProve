// script.js

const STORAGE_KEY = "fantasanremo_famiglia_v2";

let state = {
  contestants: [],
  players: []
};

// -------- INIZIALIZZAZIONE -------- //

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state = JSON.parse(saved);
      // se per qualche motivo mancano dati, reinizializza
      if (!Array.isArray(state.contestants) || state.contestants.length === 0) {
        initDefaultState();
      }
    } catch (err) {
      console.error("Errore parsing localStorage, reset:", err);
      initDefaultState();
    }
  } else {
    initDefaultState();
  }
}

function initDefaultState() {
  const contestants = [];
  for (let i = 1; i <= 20; i++) {
    contestants.push({
      id: i - 1,
      name: `Concorrente ${i}`,
      score: 0
    });
  }
  state = {
    contestants,
    players: []
  };
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// -------- RENDER UI -------- //

function renderContestantsEditor() {
  const tbody = document.getElementById("contestants-editor-body");
  tbody.innerHTML = "";

  state.contestants.forEach((c, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;

    const tdName = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.value = c.name;
    input.dataset.index = index;
    tdName.appendChild(input);

    tr.appendChild(tdIndex);
    tr.appendChild(tdName);
    tbody.appendChild(tr);
  });
}

function renderContestantsScoreTable() {
  const tbody = document.getElementById("contestants-score-body");
  tbody.innerHTML = "";

  state.contestants.forEach((c, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;

    const tdName = document.createElement("td");
    tdName.textContent = c.name;

    const tdScore = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.value = c.score || 0;
    input.min = 0;
    input.step = 1;
    input.dataset.index = index;
    input.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const val = parseInt(e.target.value, 10);
      state.contestants[idx].score = isNaN(val) ? 0 : val;
      saveState();
      recalcPlayersScores();
      renderRanking();
      updateSummary();
    });

    tdScore.appendChild(input);

    tr.appendChild(tdIndex);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    tbody.appendChild(tr);
  });
}

function renderPlayerSelects() {
  for (let i = 1; i <= 5; i++) {
    const select = document.getElementById(`pick-${i}`);
    if (!select) continue;
    select.innerHTML = "";

    state.contestants.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.name;
      select.appendChild(option);
    });
  }
}

function renderPlayersTable() {
  const tbody = document.getElementById("players-body");
  tbody.innerHTML = "";

  if (state.players.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "Nessun giocatore ancora aggiunto.";
    td.style.fontSize = "0.78rem";
    td.style.color = "#9ca3af";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  state.players.forEach((player, index) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = player.name;

    const tdTeam = document.createElement("td");
    const names = player.picks
      .map((id) => {
        const c = state.contestants.find((x) => x.id === id);
        return c ? c.name : "??";
      })
      .join(", ");
    tdTeam.textContent = names;

    const tdScore = document.createElement("td");
    tdScore.textContent = player.totalScore || 0;

    const tdActions = document.createElement("td");
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Rimuovi";
    btnDelete.className = "btn danger";
    btnDelete.style.fontSize = "0.72rem";
    btnDelete.addEventListener("click", () => {
      if (confirm(`Rimuovere il giocatore "${player.name}"?`)) {
        state.players.splice(index, 1);
        recalcPlayersScores();
        saveState();
        renderPlayersTable();
        renderRanking();
        updateSummary();
      }
    });
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdName);
    tr.appendChild(tdTeam);
    tr.appendChild(tdScore);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function renderRanking() {
  const tbody = document.getElementById("ranking-body");
  tbody.innerHTML = "";

  if (state.players.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = "Aggiungi almeno un giocatore per vedere la classifica.";
    td.style.fontSize = "0.78rem";
    td.style.color = "#9ca3af";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const sorted = [...state.players].sort(
    (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
  );

  sorted.forEach((player, index) => {
    const tr = document.createElement("tr");

    const tdPos = document.createElement("td");
    tdPos.textContent = index + 1;

    const tdName = document.createElement("td");
    tdName.textContent = player.name;

    const tdScore = document.createElement("td");
    tdScore.textContent = player.totalScore || 0;

    tr.appendChild(tdPos);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);

    tbody.appendChild(tr);
  });
}

// -------- PUNTEGGI -------- //

function recalcPlayersScores() {
  const scoreMap = {};
  state.contestants.forEach((c) => {
    scoreMap[c.id] = c.score || 0;
  });

  state.players.forEach((p) => {
    let total = 0;
    (p.picks || []).forEach((id) => {
      total += scoreMap[id] || 0;
    });
    p.totalScore = total;
  });

  saveState();
  renderPlayersTable();
}

// -------- RIASSUNTO IN ALTO -------- //

function updateSummary() {
  const elContestants = document.getElementById("summary-contestants");
  const elPlayers = document.getElementById("summary-players");
  const elLeader = document.getElementById("summary-leader");
  const elLeaderScore = document.getElementById("summary-leader-score");

  if (elContestants) elContestants.textContent = state.contestants.length;
  if (elPlayers) elPlayers.textContent = state.players.length;

  if (state.players.length === 0) {
    if (elLeader) elLeader.textContent = "Nessuno";
    if (elLeaderScore) elLeaderScore.textContent = "";
    return;
  }

  const sorted = [...state.players].sort(
    (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
  );
  const top = sorted[0];

  if (elLeader) elLeader.textContent = top.name;
  if (elLeaderScore) elLeaderScore.textContent = `${top.totalScore || 0} pt`;
}

// -------- EVENTI -------- //

function handleSaveContestantsNames() {
  const inputs = document.querySelectorAll(
    "#contestants-editor-body input[type='text']"
  );
  inputs.forEach((input) => {
    const idx = parseInt(input.dataset.index, 10);
    state.contestants[idx].name =
      input.value.trim() || `Concorrente ${idx + 1}`;
  });
  saveState();
  renderContestantsScoreTable();
  renderPlayerSelects();
  recalcPlayersScores();
  renderRanking();
  updateSummary();
  alert("Concorrenti aggiornati!");
}

function handleAddPlayer(event) {
  event.preventDefault();
  const nameInput = document.getElementById("player-name");
  const name = nameInput.value.trim();

  if (!name) {
    alert("Inserisci il nome del giocatore.");
    return;
  }

  const picks = [];
  for (let i = 1; i <= 5; i++) {
    const select = document.getElementById(`pick-${i}`);
    const id = parseInt(select.value, 10);
    picks.push(id);
  }

  const unique = new Set(picks);
  if (unique.size < picks.length) {
    const ok = confirm(
      "Hai scelto lo stesso concorrente più volte. Vuoi continuare comunque?"
    );
    if (!ok) return;
  }

  const newPlayer = {
    id: Date.now(),
    name,
    picks,
    totalScore: 0
  };

  state.players.push(newPlayer);
  recalcPlayersScores();
  renderPlayersTable();
  renderRanking();
  updateSummary();

  nameInput.value = "";
  alert("Giocatore aggiunto!");
}

function handleResetAll() {
  if (
    !confirm(
      "Vuoi davvero cancellare tutti i dati (concorrenti, giocatori, punteggi)?"
    )
  ) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  initDefaultState();
  renderAll();
  updateSummary();
  alert("Reset completato.");
}

// Tabs
function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      // bottoni
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // contenuti
      contents.forEach((c) => {
        if (c.dataset.tabContent === tab) {
          c.classList.add("active");
        } else {
          c.classList.remove("active");
        }
      });
    });
  });
}

// -------- RENDER COMPLETO -------- //

function renderAll() {
  renderContestantsEditor();
  renderContestantsScoreTable();
  renderPlayerSelects();
  recalcPlayersScores(); // include renderPlayersTable
  renderRanking();
}

// -------- AVVIO -------- //

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();
  updateSummary();
  setupTabs();

  const saveContestantsBtn = document.getElementById("save-contestants-btn");
  const playerForm = document.getElementById("player-form");
  const resetAllBtn = document.getElementById("reset-all-btn");

  if (saveContestantsBtn) {
    saveContestantsBtn.addEventListener("click", handleSaveContestantsNames);
  }
  if (playerForm) {
    playerForm.addEventListener("submit", handleAddPlayer);
  }
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", handleResetAll);
  }
});
