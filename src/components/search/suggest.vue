<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="$emit('select-singer', singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="$emit('select-song', song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch, nextTick, defineEmits } from 'vue'
import { SingerType } from '../../types/singers'
import { SongType } from '../../types/song'
import { getSearch } from '../../service/search'
import { processSongs } from '../../service/song'
import usePullUpLoad from './use-pull-up-load'

interface Props {
  query: string
  showSinger?: boolean
}

const { query, showSinger = true } = defineProps<Props>()

const singer = ref<SingerType | null>(null)
const songs = ref<SongType[]>([])
const hasMore = ref(true)
const page = ref(1)
const loadingText = ref('')
const noResultText = ref('很抱歉，暂无搜索结果')
const manualLoading = ref(false)

defineEmits(['select-song', 'select-singer'])

const noResult = computed(
  () => !singer.value && !songs.value.length && !hasMore.value
)
const loading = computed(() => !singer.value && !songs.value.length)
const pullUpLoading = computed(() => isPullUpLoad.value && hasMore.value)

const preventPullUpLoad = computed(() => loading.value || manualLoading.value)

watch(
  () => query,
  (newQuery) => {
    if (!newQuery) return
    searchFirst()
  }
)

const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(
  searchMore,
  preventPullUpLoad
)

async function searchFirst() {
  if (!query) return
  page.value = 1
  songs.value = []
  singer.value = null
  hasMore.value = true
  const result = await getSearch(query, page.value, showSinger)
  songs.value = await processSongs(result.songs)
  singer.value = result.singer
  hasMore.value = result.hasMore
}

async function searchMore() {
  if (!hasMore.value || !query) return
  page.value++
  const result = await getSearch(query, page.value, showSinger)
  songs.value = songs.value.concat(await processSongs(result.songs))
  hasMore.value = result.hasMore
  await nextTick()
  makeItScrollable()
}
async function makeItScrollable() {
  if (scroll.value.maxScrollY >= -1) {
    manualLoading.value = true
    await searchMore()
    manualLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
