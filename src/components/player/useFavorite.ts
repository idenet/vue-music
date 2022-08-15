import { usePlayerStore } from '../../store/index'
import { computed } from 'vue'
import { SongType } from '../../types/song'
import { save, remove } from '../../assets/js/array-store'
import { FAVORATE_KEY } from '../../assets/js/constant'

export default function useFavorite() {
  const maxLen = 100

  const playSotre = usePlayerStore()

  const favoriteList = computed(() => playSotre.favoriteList)

  function getFavoriteIcon(song: SongType) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song: SongType) {
    let list: SongType[] | null = null
    if (isFavorite(song)) {
      list = remove(FAVORATE_KEY, compare)
    } else {
      list = save(song, FAVORATE_KEY, compare, maxLen)
    }

    playSotre.setFavoriteList(list as SongType[])

    function compare(item: SongType) {
      return item.id === song.id
    }
  }

  function isFavorite(song: SongType) {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
