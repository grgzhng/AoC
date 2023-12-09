const fs = require("fs");

// template
fs.readFile("./races.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  const [timeRow, distanceRow] = rows;
  const times = timeRow
    .split(/\s+/)
    .slice(1)
    .map((t) => Number(t));
  const distances = distanceRow
    .split(/\s+/)
    .slice(1)
    .map((d) => Number(d));

  let product = 1;

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];

    let numWays = 0;
    let found = undefined;
    let ctr = 1;

    while (found !== false) {
      const d = (time - ctr) * ctr;
      if (d > distance) {
        if (found === undefined) {
          found = true;
        }
        numWays++;
      } else {
        if (found) {
          found = false;
        }
      }
      ctr++;
    }

    product *= numWays;
  }

  console.log(product);
});
