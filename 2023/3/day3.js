const fs = require("fs");

const isCharNum = (c) => {
  return c >= "0" && c <= "9";
};

fs.readFile("./parts.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  const numRows = rows.length;

  let sum = 0;

  for (let i = 0; i < numRows; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "*") {
        const adjacentNums = {};

        for (
          let _row = Math.max(0, i - 1);
          _row <= Math.min(numRows - 1, i + 1);
          _row++
        ) {
          adjacentNums[_row] = [];
          for (
            let _col = Math.max(0, j - 1);
            _col <= Math.min(row.length - 1, j + 1);
            _col++
          ) {
            if (isCharNum(rows[_row][_col])) {
              adjacentNums[_row].push(Number(_col));
            }
          }
        }

        // Filter out numbers next to
        for (const [r, cols] of Object.entries(adjacentNums)) {
          let prevCol = -2;
          const strippedCols = [];
          for (const col of cols) {
            if (prevCol + 1 !== col) {
              strippedCols.push(col);
            }
            prevCol = col;
          }
          adjacentNums[r] = strippedCols;
        }

        const numGears = Object.entries(adjacentNums).reduce(
          (num, [r, cols]) => {
            return num + cols.length;
          },
          0
        );

        if (numGears > 2) {
          console.log("found > 2");
        }

        if (numGears === 2) {
          let product = 1;
          for (const [row, cols] of Object.entries(adjacentNums)) {
            for (const col of cols) {
              // get prefix
              let prefix = "";
              for (let i = col - 1; i >= 0; i--) {
                if (isCharNum(rows[row][i])) {
                  prefix = rows[row][i] + prefix;
                } else {
                  break;
                }
              }
              let suffix = "";
              for (let i = col + 1; i < rows[row].length; i++) {
                if (isCharNum(rows[row][i])) {
                  suffix = suffix + rows[row][i];
                } else {
                  break;
                }
              }
              const gear = Number(prefix + rows[row][col] + suffix);
              product *= gear;
            }
          }
          sum += product;
        }
      }
    }
  }

  console.log(sum);
});

fs.readFile("./parts.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  const numRows = rows.length;
  const possiblePartLocations = {};

  for (let i = 0; i < numRows; i++) {
    possiblePartLocations[i] = new Set();
  }

  for (let i = 0; i < numRows; i++) {
    const row = rows[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] !== "." && (row[j] < "0" || row[j] > "9")) {
        for (
          let initRow = Math.max(0, i - 1);
          initRow <= Math.min(numRows - 1, i + 1);
          initRow++
        ) {
          for (
            let initCol = Math.max(0, j - 1);
            initCol <= Math.min(row.length - 1, j + 1);
            initCol++
          ) {
            possiblePartLocations[initRow].add(initCol);
            // console.log('adding ' + initRow + ', ' + initCol)
          }
        }
      }
    }
  }

  let checksum = 0;

  for (let i = 0; i < numRows; i++) {
    const row = rows[i];

    let currNum = null;
    for (let j = 0; j < row.length; j++) {
      if (isCharNum(row[j])) {
        if (currNum == null) {
          currNum = Number(row[j]);
        } else {
          currNum = currNum * 10 + Number(row[j]);
        }
      } else {
        if (currNum !== null) {
          const numDigits = currNum.toString().length;
          for (let x = j - numDigits; x < j; x++) {
            if (possiblePartLocations[i].has(x)) {
              checksum += currNum;
              break;
            }
          }
          currNum = null;
        }
      }
    }
    if (currNum !== null) {
      const numDigits = currNum.toString().length;
      for (let x = row.length - numDigits; x < row.length; x++) {
        if (possiblePartLocations[i].has(x)) {
          checksum += currNum;
          break;
        }
      }
      currNum = null;
    }
  }

  console.log(checksum);
});
