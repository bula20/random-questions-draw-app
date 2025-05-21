document.getElementById("openBtn").addEventListener("click", async () => {
  const reel = document.getElementById("reel");
  reel.innerHTML = "";

  // Pobierz pytanie, które ma się zatrzymać na środku
  const res = await fetch("/draw");
  const winningQuestion = await res.json();

  const questionWidth = 210; // 200px + 2*margin (5px)
  const visibleSlots = 5;
  const totalItems = 50; // Dużo, żeby animacja miała sens

  const questions = [];

  // Uzupełnij losowymi pytaniami
  const difficulties = ["hard", "medium", "easy", "very_easy"];
  for (let i = 0; i < totalItems; i++) {
    const randomDiv = document.createElement("div");
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    randomDiv.classList.add("question", diff);
    randomDiv.textContent = "???";
    questions.push(randomDiv);
  }

  // Wstaw zwycięską kafelkę na środek widocznej części
  const winningIndex = Math.floor(totalItems / 2);
  const winningDiv = document.createElement("div");
  winningDiv.classList.add("question", winningQuestion.difficulty);
  winningDiv.textContent = winningQuestion.question;
  questions[winningIndex] = winningDiv;

  // Dodaj wszystkie kafelki do rolki
  questions.forEach((q) => reel.appendChild(q));

  // Oblicz przesunięcie tak, by winningIndex trafił na środek kontenera
  const container = document.querySelector(".case-container");
  const containerCenter = container.offsetWidth / 2;
  const targetOffset = winningIndex * questionWidth + questionWidth / 2;
  const translateX = targetOffset - containerCenter;

  // Animacja przesuwania
  reel.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.5, 1)";
  reel.style.transform = `translateX(-${translateX}px)`;

  // Wyświetl wynik po zakończeniu animacji
  setTimeout(() => {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h2>${winningQuestion.question}</h2><p>Trudność: ${winningQuestion.difficulty}</p>`;
  }, 4000);
});
