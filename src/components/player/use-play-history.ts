import { usePlayerStore } from '../../store/index'
import { SongType } from '../../types/song'
import { save } from '../../assets/js/array-store'
import { PLAY_KEY } from '../../assets/js/constant'

export default function usePlayHistory() {
  const store = usePlayerStore()
  const maxLen = 200

  function savePlay(song: SongType) {
    const songs = save(song, PLAY_KEY, (item) => item.id === song.id, maxLen)
    store.setPlayHistory(songs)
  }
  return {
    savePlay,
  }
}
