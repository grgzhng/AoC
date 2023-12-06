const fs = require("fs");

const numCards = {};

fs.readFile("./cards.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  // Initializing each card to have 1
  const numCards = {};
  for (let i = 0; i < rows.length; i++) {
    numCards[i + 1] = 1;
  }

  let totalCards = 0;
  let currCardNum = 1;
  for (const row of rows) {
    const numCurrCards = numCards[currCardNum];

    totalCards += numCurrCards;
    const parsedRow = row.slice(row.indexOf(":") + 1).trim();
    const [winningRow, numberRow] = parsedRow.split(" | ");
    const winners = winningRow
      .trim()
      .split(" ")
      .filter((n) => n !== "");
    const numbers = numberRow
      .trim()
      .split(" ")
      .filter((n) => n !== "");

    let matches = 0;
    for (const number of numbers) {
      if (winners.includes(number)) {
        matches++;
      }
    }
    for (
      let newCardIdx = currCardNum + 1;
      newCardIdx <= currCardNum + matches;
      newCardIdx++
    ) {
      numCards[newCardIdx] += numCurrCards;
    }

    currCardNum++;
  }

  console.log(totalCards);
});

fs.readFile("./cards.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  let points = 0;
  for (const row of rows) {
    const parsedRow = row.slice(row.indexOf(":") + 1).trim();
    const [winningRow, numberRow] = parsedRow.split(" | ");
    const winners = winningRow
      .trim()
      .split(" ")
      .filter((n) => n !== "");
    const numbers = numberRow
      .trim()
      .split(" ")
      .filter((n) => n !== "");

    console.log(winners);
    console.log(numbers);

    let pts = null;
    for (const number of numbers) {
      if (winners.includes(number)) {
        if (pts == null) {
          pts = 1;
        } else {
          pts *= 2;
        }
      }
    }
    if (!!pts) {
      points += pts;
    }
  }

  console.log(points);
});
