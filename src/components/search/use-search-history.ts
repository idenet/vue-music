import { save, remove, clear } from '../../assets/js/array-store'
import { SEARCH_KEY } from './../../assets/js/constant'
import { usePlayerStore } from '../../store/index'
export default function useSearchHistory() {
  const maxLem = 200

  const store = usePlayerStore()

  function saveSearch(query: string) {
    const searches = save(query, SEARCH_KEY, (item) => item === query, maxLem)
    store.setSearchHistory(searches)
  }

  function deleteSearch(query: string) {
    const searches = remove(SEARCH_KEY, (item: string) => item === query)
    store.setSearchHistory(searches)
  }

  function clearSearch() {
    const searches: string[] = clear(SEARCH_KEY)
    store.setSearchHistory(searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  }
}
