import storage from 'good-storage'

interface CompareType<T> {
  (item: T): boolean
}

function insertArray<T>(
  arr: T[],
  val: T,
  compare: CompareType<T>,
  maxLen?: number
) {
  const index = arr.findIndex(compare)
  if (index > -1) return
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray<T>(arr: T[], compare: CompareType<T>) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save<T>(
  item: T,
  key: string,
  compare: CompareType<T>,
  maxLen?: number
): T[] {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove<T>(key: string, compare: CompareType<T>): T[] {
  const items: T[] = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key: string) {
  return storage.get(key, [])
}

export function clear<T>(key: string): T[] {
  storage.remove(key)
  return []
}
