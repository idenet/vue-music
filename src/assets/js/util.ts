import { SongType } from '@/types/song'

export function shuffle(source: SongType[]): SongType[] {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(arr: SongType[], i: number, j: number) {
  const t = arr[i]
  arr[j] = arr[i]
  arr[i] = t
}
