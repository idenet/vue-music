<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query" @clear="query = ''"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys" v-show="hotKeys.length">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import searchInput from '@/components/search/search-input.vue'
import scroll from '@/components/wrap-scroll'
import suggest from '@/components/search/suggest.vue'
import searchList from '@/components/search/search-list.vue'
import confirm from '@/components/base/comfirm/confirm.vue'

import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { getHotKeys } from '../service/search'
import { hotKeyType } from '../types/hotKey'
import { SongType } from '../types/song'
import { usePlayerStore } from '@/store'
import { SingerType } from '../types/singers'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '../components/search/use-search-history'

const query = ref<string>('')
const hotKeys = ref<hotKeyType[]>([])
const selectedSinger = ref<SingerType | null>(null)
const scrollRef = ref<any>(null)
const confirmRef = ref<any>(null)

const store = usePlayerStore()
const router = useRouter()
const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

const searchHistory = computed(() => store.searchHistory)

watch(query, async (newQuery) => {
  if (!newQuery) {
    await nextTick()
    refreshScroll()
  }
})

onMounted(() => {
  _getHotKeys()
})

function refreshScroll() {
  scrollRef.value.scroll.refresh()
}

function showConfirm() {
  confirmRef.value.show()
}

async function _getHotKeys() {
  const result = await getHotKeys()
  hotKeys.value = result ? result.hotkey : []
}

function addQuery(key: string) {
  query.value = key
}

function selectSong(song: SongType) {
  saveSearch(query.value)
  store.addSong(song)
}

function selectSinger(singer: SingerType) {
  saveSearch(query.value)
  selectedSinger.value = singer
  cacheSinger(singer)
  router.push({
    path: `/search/${singer.mid}`,
  })
}

function cacheSinger(singer: SingerType) {
  storage.session.set(SINGER_KEY, singer)
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
