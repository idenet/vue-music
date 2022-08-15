import storage from 'good-storage'
import { SongType } from '../../types/song'

interface CompareType {
  (item: SongType): boolean
}

function insertArray(arr: SongType[], val: SongType, compare: CompareType, maxLen?: number) {
  const index = arr.findIndex(compare)
  if (index > -1) return
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr: SongType[], compare: CompareType) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item: SongType, key: string, compare: CompareType, maxLen?: number): SongType[] {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key: string, compare: CompareType): SongType[] {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key: string) {
  return storage.get(key, [])
}
