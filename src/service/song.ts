import { get } from './base'
import { SongType } from '../types/song'

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

interface LyricType {
  [mid: string]: string
}

const lyricMap: LyricType = {}

export function getLyric(song: SongType) {
  if (song.lyric) { return Promise.resolve(song.lyric) }
  const mid: string = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', { mid }).then(res => {
    const lyric = res ? res.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
