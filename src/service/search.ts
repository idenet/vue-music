import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function getSearch(query: string, page: number, showSinger: boolean) {
  return get('/api/search', {
    query,
    page,
    showSinger,
  })
}
