// script.js

document.addEventListener("DOMContentLoaded", () => {
  evidenziaOggiCalendario();
});

function evidenziaOggiCalendario() {
  const oggi = new Date();
  const giorno = oggi.getDate().toString();

  const celle = document.querySelectorAll(".calendar-grid span");
  celle.forEach((cell) => {
    if (cell.textContent.trim() === giorno) {
      cell.classList.add("today");
    }
  });
}
