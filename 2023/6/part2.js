const fs = require("fs");

const solveQ = (a, b, c) => {
  const solutions = [];
  solutions.push((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
  solutions.push((-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
  return solutions;
};

// template
fs.readFile("./races.txt", (err, data) => {
  if (err) {
    throw err;
  }

  const inputs = data.toString();
  const rows = inputs.split("\n").map((row) => row.trim());

  const [timeRow, distanceRow] = rows;
  const time = Number(
    timeRow
      .split(/\s+/)
      .slice(1)
      .reduce((acc, currTime) => {
        return acc + currTime;
      }, "")
  );
  const distance = Number(
    distanceRow
      .split(/\s+/)
      .slice(1)
      .reduce((acc, currDistance) => {
        return acc + currDistance;
      }, "")
  );

  const [s1, s2] = solveQ(1, -time, distance);

  console.log(Math.floor(Math.max(s1, s2)) - Math.ceil(Math.min(s1, s2)) + 1);
});
