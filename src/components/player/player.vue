<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="playerStore.fullScreenGetter">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h1 class="subtitle">{{ currentSong.singer }}</h1>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.time"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progressBar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progressBar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                :class="getFavoriteIcon(currentSong)"
                @click="toggleFavorite(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <miniPlayer :progress="progress" :togglePlay="togglePlay"></miniPlayer>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script lang="ts" setup>
import scroll from '../base/scroll/scroll.vue'
import { PLAYMODE, usePlayerStore } from '../../store/index'
import { ref, watch, computed, nextTick } from 'vue'
import useMode from './useMode'
import useFavorite from './useFavorite'
import progressBar from './progress-bar.vue'
import { formatTime } from '@/assets/js/util'
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import miniPlayer from './mini-player.vue'
import useAnimation from './use-animation'
import usePlayHistory from './use-play-history'

const audioRef = ref<HTMLAudioElement | null>(null)
const songReady = ref<boolean>(false)
const currentTime = ref<number>(0)
const barRef = ref<any>(null)

const playerStore = usePlayerStore()

const { modeIcon, changeMode } = useMode()
const { toggleFavorite, getFavoriteIcon } = useFavorite()
const { cdCls, cdRef, cdImageRef } = useCd()
const {
  currentLyric,
  currentLineNum,
  playLyric,
  lyricScrollRef,
  lyricListRef,
  stopLyric,
  pureMusicLyric,
  playingLyric,
} = useLyric({ songReady, currentTime })

const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
} = useMiddleInteractive()

const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
const { savePlay } = usePlayHistory()

// pinia getter
const currentSong = computed(() => playerStore.currentSong)
const playing = computed(() => playerStore.playing)
const currentIndex = computed(() => playerStore.currentIndex)
const playList = computed(() => playerStore.playList)
const playMode = computed(() => playerStore.playMode)

const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
})
const disableCls = computed(() => (songReady.value ? '' : 'disable'))
const progress = computed(() => currentTime.value / currentSong.value.duration)

// watch
watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) return
  songReady.value = false // ???????????????????????????false
  currentTime.value = 0
  const audioEl = audioRef.value as HTMLAudioElement
  audioEl.src = newSong.url
  audioEl.play()
  playerStore.setPlayState(true)
})

watch(playing, (newPlaying) => {
  if (!songReady.value) return
  const audioEl = audioRef.value as HTMLAudioElement
  if (newPlaying) {
    audioEl.play()
    playLyric()
  } else {
    audioEl.pause()
    stopLyric()
  }
})

watch(
  () => playerStore.fullScreenGetter,
  async (newFullScreen) => {
    if (newFullScreen) {
      await nextTick()
      barRef.value.setOffset(progress.value)
    }
  }
)

// function
function goBack() {
  playerStore.setFullScreen(false)
}
/**
 * ??????????????????
 */
function togglePlay() {
  if (!songReady.value) return
  playerStore.setPlayState(!playing.value)
}
/**
 * ???????????????????????????
 */
function pause() {
  playerStore.setPlayState(false)
}

function prev() {
  const list = playList.value
  if (!songReady.value || !list.length) return
  if (list.length === 1) {
    _loop()
  } else {
    let index = currentIndex.value - 1
    if (index === -1) {
      index = list.length - 1
    }
    playerStore.setCurrentIndex(index)
  }
}

function next() {
  const list = playList.value
  if (!songReady.value || !list.length) return
  if (list.length === 1) {
    _loop()
  } else {
    let index = currentIndex.value + 1
    if (index === list.length) {
      index = 0
    }
    playerStore.setCurrentIndex(index)
  }
}

function ready() {
  if (songReady.value) return
  songReady.value = true
  playLyric()
  savePlay(currentSong.value)
}

function error() {
  songReady.value = true // ??????????????????????????????
}
let progressChanging = false

function updateTime(e: any) {
  if (!progressChanging) {
    currentTime.value = e.target.currentTime
  }
}

function onProgressChanging(progress: number) {
  progressChanging = true
  currentTime.value = currentSong.value.duration * progress
  playLyric() // ?????????????????????
  stopLyric()
}

function onProgressChanged(progress: number) {
  progressChanging = false
  const audio = audioRef.value as HTMLAudioElement
  audio.currentTime = currentTime.value = currentSong.value.duration * progress
  if (!playing.value) {
    playerStore.setPlayState(true)
  }
  playLyric() // ?????????????????????
}

function end() {
  currentTime.value = 0
  if (playMode.value === PLAYMODE.loop) {
    _loop()
  } else {
    next()
  }
}

function _loop() {
  const audioEl = audioRef.value as HTMLAudioElement
  audioEl.currentTime = 0
  audioEl.play()
  playerStore.setPlayState(true)
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
