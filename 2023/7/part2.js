const fs = require("fs");

// template
// fs.readFile('./file.txt', (err, data) => {
//   if (err) {
//     throw err
//   }

//   const inputs = data.toString()
//   const rows = inputs.split('\n').map((row) => row.trim())

// })

/**
 *
 * @param {*} h
 * @returns 1 for high card, 2 for pair, 3 for two pair, 4 for three of a kind
 * 5 for full house, 6 for four of a kind, 7 for five of a kind
 */
const getHand = (h) => {
  const map = {};
  for (const c of h) {
    map[c] = (map[c] ?? 0) + 1;
  }
  const cards = Object.entries(map);
  cards.sort(([_, n1], [__, n2]) => {
    return n2 - n1;
  });

  let jokers = (fi = fo = th = tw = 0);
  for (const [c, n] of cards) {
    if (c === "J") {
      jokers = n;
    } else if (n === 5) {
      fi++;
    } else if (n === 4) {
      fo++;
    } else if (n === 3) {
      th++;
    } else if (n == 2) {
      tw++;
    }
  }

  if (fi) {
    return 7;
  } else if (fo) {
    return 6 + jokers;
  } else if (th) {
    if (jokers) {
      return 5 + jokers;
    }
    if (tw) {
      return 5;
    }
    return 4;
  } else if (tw == 2) {
    if (jokers) {
      return 5;
    }
    return 3;
  } else if (tw == 1) {
    switch (jokers) {
      case 3:
        return 7;
      case 2:
        return 6;
      case 1:
        return 4;
      default:
        return 2;
    }
  }
  switch (jokers) {
    case 5:
    case 4:
      return 7;
    case 3:
      return 6;
    case 2:
      return 4;
    case 1:
      return 2;
    default:
      return 1;
  }
};

// c -> character
const getCard = (c) => {
  if (c >= "0" && c <= "9") {
    return Number(c) + 1;
  } else if (c === "K") {
    return 13;
  } else if (c === "Q") {
    return 12;
  } else if (c === "J") {
    return 1;
  } else if (c === "T") {
    return 11;
  } else {
    return 14;
  }
};

const compareHands = (h1, h2) => {
  const _h1 = getHand(h1);
  const _h2 = getHand(h2);

  if (_h1 !== _h2) {
    return _h2 - _h1;
  }

  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) {
      return getCard(h2[i]) - getCard(h1[i]);
    }
  }

  console.log("something is broken...");
};

// console.log(compareHands("K4444", "55557"));

fs.readFile("./cards.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());
  const parsedRows = rows.map((r) => r.split(" "));

  // Ensure there's no duplicate cards (i.e. no ties)
  let cards = new Set();
  for (const row of parsedRows) {
    const card = row[0];
    if (cards.has(card)) {
      console.log("has card dupe");
    }
    cards.add(card);
  }

  parsedRows.sort((r1, r2) => {
    const [c1, b1] = r1;
    const [c2, b2] = r2;

    return compareHands(c1, c2);
  });

  let winnings = 0;
  let rank = parsedRows.length;
  for (const [c, b] of parsedRows) {
    console.log(c, b, rank);

    winnings += b * rank;
    rank--;
  }

  console.log(winnings);
});
