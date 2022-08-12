export function shuffle(source: []): [] {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr as [], i, j)
  }
  return arr as []
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr: [], i: number, j: number) {
  const t = arr[i]
  arr[j] = arr[i]
  arr[i] = t
}
