import { get } from './base'

export function processSongs(songs: any) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map((item: { mid: any }) => item.mid)
  }).then(result => {
    const map = result.map
    return songs.map((song: { url: any; mid: string | number }) => {
      song.url = map[song.mid]
      return song
    }).filter((song: { url: string | string[] }) => {
      return song.url.indexOf('vkey') > -1
    })
  })
}
