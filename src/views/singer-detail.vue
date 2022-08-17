<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, computed } from 'vue'
import { SingerType } from '../types/singers'
import { getSingerDetail } from '../service/singer'
import { processSongs } from '../service/song'
import MusicList from '@/components/music-list/music-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '../assets/js/constant'
import { useRoute, useRouter } from 'vue-router'

interface singerT {
  singer: SingerType
}

const props = defineProps<singerT>()

const songs = ref([])
const loading = ref<boolean>(true)

const route = useRoute()
const router = useRouter()

onMounted(() => {
  _getSingerDetail()
})

const pic = computed(() => {
  const singer = computedSinger.value
  return singer && singer.pic
})

const title = computed(() => {
  const singer = computedSinger.value
  return singer && singer.name
})

const computedSinger = computed(() => {
  let ret = null
  const singerV = props.singer
  if (singerV) {
    ret = singerV
  } else {
    const cachedSinger = storage.session.get(SINGER_KEY)
    if (cachedSinger && cachedSinger.mid === route.params.id) {
      ret = cachedSinger
    }
  }
  return ret
})

async function _getSingerDetail() {
  if (!computedSinger.value) {
    const path = route.matched[0].path
    router.push({ path })
    return
  }
  const result = await getSingerDetail(computedSinger.value)
  songs.value = await processSongs(result.songs)
  loading.value = false
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
