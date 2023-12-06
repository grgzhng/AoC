
// DAY 2

const fs = require('fs')

fs.readFile('./games.txt', (err, data) => {
  if (err) {
    throw err
  }
  const input = data.toString()
  const inputRows = input.split('\n')

  let sum = 0

  for (const row of inputRows) {
    const maxColors = {
      red: 0,
      green: 0,
      blue: 0,
    }

    const indexColon = row.indexOf(':')
    const gameId = row.slice(0, indexColon).slice(5)

    let draws = row.slice(indexColon + 2)

    console.log(draws)

    while (draws !== '') {
      const draw = draws.indexOf(';') === -1 ? draws : draws.slice(0, draws.indexOf(';'))

      for (const colorCount of draw.split(', ')) {
        const [num, color] = colorCount.split(' ')

        maxColors[color] = Math.max(maxColors[color], Number(num))
      }

      if (draws.indexOf(';') !== -1) {
        draws = draws.slice(draws.indexOf(';') + 2)
      } else {
        draws = ''
      }
    }

    sum += Object.values(maxColors).reduce((power, currVal) => {
      return power * currVal
    }, 1)
  }

  console.log(sum)
})

const MAX_COLORS = {
  'red': 12,
  'green': 13,
  'blue': 14
}

fs.readFile('./games.txt', (err, data) => {
  if (err) {
    throw err
  }
  const input = data.toString()
  const inputRows = input.split('\n')

  let sum = 0

  for (const row of inputRows) {
    const indexColon = row.indexOf(':')
    const gameId = row.slice(0, indexColon).slice(5)

    let draws = row.slice(indexColon + 2)
    let impossible = false

    console.log(draws)

    while (draws !== '') {
      const draw = draws.indexOf(';') === -1 ? draws : draws.slice(0, draws.indexOf(';'))

      console.log(draw)

      for (const colorCount of draw.split(', ')) {
        const [num, color] = colorCount.split(' ')

        console.log(num, color)
        if (Number(num) > MAX_COLORS[color]) {
          impossible = true
          break
        }
      }

      if (impossible) {
        break
      }

      if (draws.indexOf(';') !== -1) {
        draws = draws.slice(draws.indexOf(';') + 2)
      } else {
        draws = ''
      }
    }

    if (!impossible) {
      sum += Number(gameId)
    }
  }

  console.log(sum)
})

