const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/draw", (req, res) => {
  fs.readFile("./questions.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const questions = JSON.parse(data);
    const weights = {
      hard: 40,
      medium: 30,
      easy: 20,
      very_easy: 10,
    };

    const pool = [];
    for (let q of questions) {
      const chance = weights[q.difficulty];
      for (let i = 0; i < chance; i++) {
        pool.push(q);
      }
    }

    const result = pool[Math.floor(Math.random() * pool.length)];
    res.json(result);
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
