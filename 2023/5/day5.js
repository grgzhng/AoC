const fs = require("fs");

// template
// fs.readFile('./file.txt', (err, data) => {
//   if (err) {
//     throw err
//   }

//   const inputs = data.toString()
//   const rows = input.split('\n').map((row) => row.trim())

// })

/**
 * Each map maps to the type below.
 * Humidity maps to location
 */
const maps = {
  seed: { next: "soil", translationArr: [] },
  soil: { next: "fertilizer", translationArr: [] },
  fertilizer: { next: "water", translationArr: [] },
  water: { next: "light", translationArr: [] },
  light: { next: "temperature", translationArr: [] },
  temperature: { next: "humidity", translationArr: [] },
  humidity: { next: null, translationArr: [] },
};

fs.readFile("./soils.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n\n").map((row) => row.trim());

  const seedsRow = rows[0];
  const seeds = seedsRow.slice(seedsRow.indexOf(":") + 2).split(" ");

  for (const map of rows.slice(1)) {
    const rows = map.split("\n");
    const labelRow = rows[0];
    const mapType = labelRow.slice(0, labelRow.indexOf("-"));
    const valueRows = rows.slice(1);

    for (const values of valueRows) {
      const [destStart, sourceStart, range] = values.trim().split(" ");
      maps[mapType].translationArr.push({
        sourceStart: Number(sourceStart),
        destStart: Number(destStart),
        range: Number(range),
      });
    }
    maps[mapType].translationArr.sort((a, b) => a.sourceStart - b.sourceStart);
  }

  let minLocation = null;

  for (const seed of seeds) {
    let currCategory = "seed";
    let currVal = seed;
    while (currCategory !== null) {
      if (seed === "1310704671") {
        console.log(currVal);
      }

      const map = maps[currCategory];
      const { next: nextCategory, translationArr } = map;

      for (const line of translationArr) {
        const { destStart, sourceStart, range } = line;
        if (currVal >= sourceStart && currVal < sourceStart + range) {
          const difference = currVal - sourceStart;
          currVal = destStart + difference;
          break;
        }
      }

      // Iterate to next category
      currCategory = nextCategory;
    }

    console.log(seed, currVal);
    minLocation =
      minLocation == null ? currVal : Math.min(minLocation, currVal);
  }

  console.log(minLocation);
});
