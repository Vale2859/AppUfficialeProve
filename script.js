// script.js

// Chiave per il salvataggio in localStorage
const STORAGE_KEY = "fantasanremo_famiglia_v1";

// Stato base
let state = {
  contestants: [],
  players: []
};

// ---------- Inizializzazione ----------

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error("Errore parsing localStorage, resetto stato:", e);
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

// ---------- Render UI ----------

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
    });
    tdScore.appendChild(input);

    tr.appendChild(tdIndex);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    tbody.appendChild(tr);
  });
}

function renderPlayerSelects() {
  // Riempi tutte le select pick-1...pick-5 con i concorrenti
  for (let i = 1; i <= 5; i++) {
    const select = document.getElementById(`pick-${i}`);
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
    td.style.fontSize = "0.85rem";
    td.style.color = "#6b7280";
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
    btnDelete.style.fontSize = "0.8rem";
    btnDelete.addEventListener("click", () => {
      if (confirm(`Vuoi davvero rimuovere il giocatore "${player.name}"?`)) {
        state.players.splice(index, 1);
        recalcPlayersScores();
        saveState();
        renderPlayersTable();
        renderRanking();
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
    td.textContent = "Aggiungi prima i giocatori e i punteggi dei concorrenti.";
    td.style.fontSize = "0.85rem";
    td.style.color = "#6b7280";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  // Copia e ordina per punteggio
  const sorted = [...state.players].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

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

// ---------- Logica punteggi ----------

function recalcPlayersScores() {
  // Mappa id concorrente -> punteggio
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

// ---------- Gestione eventi ----------

function handleSaveContestantsNames() {
  const inputs = document.querySelectorAll("#contestants-editor-body input[type='text']");
  inputs.forEach((input) => {
    const idx = parseInt(input.dataset.index, 10);
    state.contestants[idx].name = input.value.trim() || `Concorrente ${idx + 1}`;
  });
  saveState();
  renderContestantsScoreTable();
  renderPlayerSelects();
  renderPlayersTable();
  renderRanking();
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

  // Raccogli pick
  const picks = [];
  for (let i = 1; i <= 5; i++) {
    const select = document.getElementById(`pick-${i}`);
    const id = parseInt(select.value, 10);
    picks.push(id);
  }

  // Controlla doppioni
  const unique = new Set(picks);
  if (unique.size < picks.length) {
    if (!confirm("Hai selezionato lo stesso concorrente più volte. Vuoi continuare lo stesso?")) {
      return;
    }
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

  // Reset parziale form
  nameInput.value = "";
  alert("Giocatore aggiunto!");
}

function handleResetAll() {
  if (!confirm("Sei sicuro di voler cancellare tutti i dati (concorrenti, giocatori, punteggi)?")) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  initDefaultState();
  renderAll();
  alert("Reset completato.");
}

// ---------- Render generale ----------

function renderAll() {
  renderContestantsEditor();
  renderContestantsScoreTable();
  renderPlayerSelects();
  recalcPlayersScores(); // questo richiama renderPlayersTable
  renderRanking();
}

// ---------- Avvio ----------

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();

  // Event listeners
  const saveContestantsBtn = document.getElementById("save-contestants-btn");
  const playerForm = document.getElementById("player-form");
  const resetAllBtn = document.getElementById("reset-all-btn");

  saveContestantsBtn.addEventListener("click", handleSaveContestantsNames);
  playerForm.addEventListener("submit", handleAddPlayer);
  resetAllBtn.addEventListener("click", handleResetAll);
});
