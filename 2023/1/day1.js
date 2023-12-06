// DAY 1
const fs = require('fs')

const strToNum = (str) => {
  if (str.match(/\d/)) {
    return Number(str)
  }
  if (str.length === 3) {
    switch (str[0]) {
      case 'o':
        return 1
      case 't':
        return 2
      case 's':
        return 6
    }
  } else if (str.length === 4) {
    switch (str[2]) {
      case 'u':
        return 4
      case 'v':
        return 5
      case 'n':
        return 9
    }
  }
  switch (str[0]) {
    case 't':
      return 3
    case 's':
      return 7
    case 'e':
      return 8
  }

  return 0
}

fs.readFile('./doc.txt', (err, data) => {
  if (err) {
    throw err
  }
  const input = data.toString()
  const inputRows = input.split('\n')

  let sum = 0
  for (const row of inputRows) {
    const numChars = row.match(/\d|one|two|three|four|five|six|seven|eight|nine/)
    const firstNum = strToNum(numChars[0])

    const reversedRow = row.split('').reverse().join('')
    const lastNumReversed = reversedRow.match(/\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/)
    const lastNum = strToNum(lastNumReversed[0].split('').reverse().join(''))
    const num = firstNum * 10 + lastNum

    sum += num
  }

  console.log(sum)
})
