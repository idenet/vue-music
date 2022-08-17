import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import storage from 'good-storage'
import { processSongs } from '@/service/song'
import { SingerType } from '@/types/singers'

interface singerT {
  data: SingerType
}

export default function useCreateDetailComponent(
  props: singerT,
  key: string,
  fetch: any
) {
  const songs = ref([])
  const loading = ref<boolean>(true)

  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    _getSingerDetail()
  })

  const pic = computed(() => {
    const singer = computedData.value
    return singer && singer.pic
  })

  const title = computed(() => {
    const singer = computedData.value
    return singer && (singer.name || singer.title)
  })

  const computedData = computed(() => {
    let ret = null
    const singerV = props.data
    if (singerV) {
      ret = singerV
    } else {
      const cached = storage.session.get(key)
      if (cached && (cached.mid || cached.id + '') === route.params.id) {
        ret = cached
      }
    }
    return ret
  })

  async function _getSingerDetail() {
    const data = computedData.value

    if (!data) {
      const path = route.matched[0].path
      router.push({ path })
      return
    }
    const result = await fetch(data)
    songs.value = await processSongs(result.songs)
    loading.value = false
  }
  return {
    songs,
    pic,
    title,
    loading,
  }
}
