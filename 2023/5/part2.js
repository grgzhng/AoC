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
  const seedsCopy = seedsRow.slice(seedsRow.indexOf(":") + 2).split(" ");
  const seedsWithRange = [];
  while (seeds.length !== 0) {
    seedsWithRange.push(seeds.splice(0, 2));
  }

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

  let mapsArr = Object.entries(maps).map(([mapType, map]) => {
    return map.translationArr;
  });

  // Pre-process the data to add in things that aren't there
  mapsArr = mapsArr.map((map) => {
    const processedMap = [];
    let start = 0;
    for (const line of map) {
      const { sourceStart, range } = line;
      if (start < line.sourceStart) {
        // TODO
        processedMap.push({
          sourceStart: start,
          destStart: start,
          range: sourceStart - start,
        });
      }
      processedMap.push(line);
      start = sourceStart + range;
    }
    processedMap.push({
      sourceStart: start,
      destStart: start,
      range: Number.MAX_SAFE_INTEGER - start,
    });

    return processedMap;
  });

  // for (const [idx, map] of mapsArr.entries()) {
  //   console.log("————— " + idx + " —————");

  //   map.sort((a, b) => a.sourceStart - b.sourceStart);
  //   let lowestVal = 0;
  //   for (const line of map) {
  //     const { sourceStart, destStart, range } = line;
  //     if (sourceStart !== lowestVal) {
  //       console.log(line);
  //       console.log("missing", lowestVal, sourceStart);
  //     } else {
  //       lowestVal = sourceStart + range;
  //     }
  //   }
  //   console.log("————— " + idx + " —————");
  //   console.log("——————————————————————————————");

  //   map.sort((a, b) => a.destStart - b.destStart);
  //   lowestVal = 0;
  //   for (const line of map) {
  //     const { sourceStart, destStart, range } = line;
  //     if (destStart !== lowestVal) {
  //       console.log("dest");
  //       console.log("missing", lowestVal, destStart);
  //     } else {
  //       lowestVal = destStart + range;
  //     }
  //   }
  // }

  /**
   * New map represents the translation from SEED down to whatever the next
   * following category is. So, initially it's seed -> soil, then it'll end up as
   * seed -> humidity
   */
  // console.log(mapsArr.slice(0, 1));
  let newMap = mapsArr.shift();

  while (mapsArr.length !== 0) {
    const map = mapsArr.shift();

    // console.log(newMap);
    for (const seed of [1310704671]) {
      let currVal = seed;

      for (const line of newMap) {
        const { destStart, sourceStart, range } = line;
        if (currVal >= sourceStart && currVal < sourceStart + range) {
          const difference = currVal - sourceStart;
          currVal = destStart + difference;
          break;
        }
      }

      console.log(seed, currVal, typeof currVal);
    }
    // END TEST BLOCK

    console.log(newMap);

    const nextMap = [];

    // Here, we iterate through the lines of the map we've constructed thus far
    // and translate them one category further with the next map
    for (const line of newMap) {
      const { sourceStart, destStart, range } = line;

      // Find the line in the next map where destStart falls within sourceStart & sourceStart + range
      for (const _line of map) {
        const { sourceStart: ss, destStart: ds, range: r } = _line;
        // console.log(ss, ds, r);
        if (destStart >= ss && destStart < ss + r) {
          /**
           * This is the offset between the destination start from the MAP thus far
           * to the source start of the current map
           */
          const offset = destStart - ss;

          const newRange = Math.min(destStart + range, ss + r) - destStart;
          nextMap.push({
            sourceStart: sourceStart,
            destStart: ds + offset,
            range: newRange,
          });

          if (newRange < range) {
            // Add in portion of this line that hasn't yet been translated yet
            newMap.push({
              sourceStart: sourceStart + newRange,
              destStart: destStart + newRange,
              range: range - newRange,
            });
          }
        }
      }
    }

    nextMap.sort((a, b) => a.sourceStart - b.sourceStart);

    newMap = nextMap;
    // console.log(newMap);
  }

  let minLocation = null;

  for (const [seed, range] of seedsWithRange) {
    const s = Number(seed);
    const r = Number(range);
    const e = s + r - 1;

    for (const line of newMap) {
      const { destStart, sourceStart, range } = line;
      const end = sourceStart + range - 1;

      if (s < sourceStart) {
        if (e > sourceStart) {
          minLocation =
            minLocation == null ? destStart : Math.min(minLocation, destStart);
        }
      } else if (s <= end) {
        const offset = s - sourceStart;
        minLocation =
          minLocation == null
            ? destStart + offset
            : Math.min(minLocation, destStart + offset);
      }
    }
    // for (let _seed = seed; _seed < seed + range; _seed++) {
    //   let currCategory = "seed";
    //   let currVal = _seed;
    //   while (currCategory !== null) {
    //     const map = maps[currCategory];
    //     const { next: nextCategory, translationArr } = map;
    //     for (const line of translationArr) {
    //       const { destStart, sourceStart, range } = line;
    //       if (currVal >= sourceStart && currVal < sourceStart + range) {
    //         const difference = currVal - sourceStart;
    //         currVal = destStart + difference;
    //         break;
    //       }
    //     }
    //     // Iterate to next category
    //     currCategory = nextCategory;
    //   }
    //   minLocation =
    //     minLocation == null ? currVal : Math.min(minLocation, currVal);
    // }
  }

  // for (const seed of seedsCopy) {
  //   let currVal = seed;

  //   for (const line of newMap) {
  //     const { destStart, sourceStart, range } = line;
  //     if (currVal >= sourceStart && currVal < sourceStart + range) {
  //       const difference = currVal - sourceStart;
  //       currVal = destStart + difference;
  //       break;
  //     }
  //   }

  //   console.log(seed, currVal);
  //   minLocation =
  //     minLocation == null ? currVal : Math.min(minLocation, currVal);
  // }

  console.log(minLocation);
});
