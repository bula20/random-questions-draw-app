async function startDraw() {
  const openBtn = document.getElementById("openBtn");
  if (openBtn.disabled) return; // blokada podczas animacji

  openBtn.disabled = true;

  const reel = document.getElementById("reel");
  const resultDiv = document.getElementById("result");

  // Reset planszy i wyniku
  reel.innerHTML = "";
  resultDiv.innerHTML = "";

  // Pobierz pytanie z serwera
  const res = await fetch("/draw");
  const winningQuestion = await res.json();

  const questionWidth = 210;
  const totalItems = 50;
  const questions = [];
  const difficulties = ["hard", "medium", "easy", "very_easy"];

  // Generuj kafelki z losowymi pytaniami (???)
  for (let i = 0; i < totalItems; i++) {
    const div = document.createElement("div");
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    div.classList.add("question", diff);
    div.textContent = "???";
    questions.push(div);
  }

  // Wstaw w środek wylosowane pytanie
  const winningIndex = Math.floor(totalItems / 2);
  const winningDiv = document.createElement("div");
  winningDiv.classList.add("question", winningQuestion.difficulty);
  winningDiv.textContent = winningQuestion.question;
  questions[winningIndex] = winningDiv;

  // Dodaj kafelki do reel
  questions.forEach((q) => reel.appendChild(q));

  const container = document.querySelector(".case-container");
  const containerCenter = container.offsetWidth / 2;
  const targetOffset = winningIndex * questionWidth + questionWidth / 2;
  const translateX = targetOffset - containerCenter;

  const animationDuration = 4000;

  // Resetuj transformację
  reel.style.transition = "none";
  reel.style.transform = "translateX(0px)";
  void reel.offsetWidth; // force reflow

  // Start animacji przesuwu
  reel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
  reel.style.transform = `translateX(-${translateX}px)`;

  // Po zakończeniu animacji:
  setTimeout(() => {
    // Animacja flash na wygranej kafelce
    const winningTile = reel.children[winningIndex];
    winningTile.classList.add("flash");

    // Pokaż modal z pytaniem
    document.getElementById("modalQuestion").textContent =
      winningQuestion.question;
    document.getElementById(
      "modalDifficulty"
    ).textContent = `Trudność: ${winningQuestion.difficulty}`;
    document.getElementById("modal").classList.remove("hidden");

    // Odblokuj przycisk
    openBtn.disabled = false;
  }, animationDuration);
}

// Obsługa kliknięcia przycisku
document.getElementById("openBtn").addEventListener("click", startDraw);

// Obsługa klawisza spacji
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    const modal = document.getElementById("modal");

    if (!modal.classList.contains("hidden")) {
      // Jeśli modal jest otwarty, zamknij go
      modal.classList.add("hidden");
    } else {
      // Jeśli modal jest zamknięty, rozpocznij losowanie
      startDraw();
    }
  }
});

// Obsługa zamykania modala przez kliknięcie w ×
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});
