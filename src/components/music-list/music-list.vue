
<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ props.title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll class="list" :style="scrollStype" v-loading="loading" v-no-result:[noResultTextn]="noResult" :probe-type="3"
      @scroll="onScroll">
      <div class="song-list-wrapper">
        <song-list :songs="props.songs" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted } from 'vue'
import { SongType } from '../../types/song'
import SongList from '@/components/base/song-list/song-list.vue'
import scroll from '@/components/base/scroll/scroll.vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../../store/index'

const RESERVED_HEIGHT = 40

interface Props {
  songs: SongType[]
  pic: string
  title: string,
  loading: boolean,
  noResultText?: string
}

const props = defineProps<Props>()
const imageHeight = ref<number>(0)
const bgImage = ref<HTMLDivElement | null>(null)
const scrollY = ref<number>(0)
const maxTranslateY = ref<number>(0)

const router = useRouter()
const playStore = usePlayerStore()

const noResultTextn = computed(() => {
  return props.noResultText ? props.noResultText : '抱歉，没有找到可播放的歌曲'
})

// 背景图片
const bgImageStyle = computed(() => {
  let zIndex = 0
  let paddingTop: number | string = '70%'
  let height: number | string = 0
  let translateZ = 0 // 解决移动端bug

  if (scrollY.value > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = `${RESERVED_HEIGHT}px`
    translateZ = 1
  }

  // 乡下拉的功能
  let scale = 1
  if (scrollY.value < 0) {
    scale = 1 + Math.abs(scrollY.value / imageHeight.value)
  }

  return {
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
    transform: `scale(${scale}) translateZ(${translateZ}px)`
  }
})
// 滚动的样式
const scrollStype = computed(() => {
  return {
    top: `${imageHeight.value}px`
  }
})
// 模糊的computed
const filterStyle = computed(() => {
  let blur = 0
  const imageHeightV = imageHeight.value
  if (scrollY.value >= 0) {
    blur = Math.min(maxTranslateY.value / imageHeightV, scrollY.value / imageHeightV) * 20
  }
  return {
    backdropFilter: `blur(${blur}px)`
  }
})

const noResult = computed(() => {
  return !props.loading && !props.songs.length
})

const playBtnStyle = computed(() => {
  let display = ''
  if (scrollY.value >= maxTranslateY.value) {
    display = 'none'
  }
  return {
    display
  }
})

onMounted(() => {
  imageHeight.value = bgImage.value?.clientHeight as number
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
})

function goBack() {
  router.back()
}

function onScroll(pos: any) {
  scrollY.value = -pos.y
}

function selectItem({ song, index }: { song: SongType, index: number }) {
  playStore.selectPlay({
    list: props.songs as [],
    index
  })
}

function random() {
  playStore.randomPlay(props.songs as [])
}

</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;

    // padding-top: 70%;
    // height: 0;

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
