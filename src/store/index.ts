import { defineStore } from 'pinia'
import { SongType } from '../types/song'
import { shuffle } from '../assets/js/util'

enum PLAYMODE {
  sqeuence = 0,
  loop = 1,
  random = 2
}
// 播放的store
export const usePlayerStore = defineStore('player', {
  state: () => ({
    sequeceList: [], // 歌曲列表
    playList: [], // 真实的播放列表
    playing: false, // 播放状态
    playMode: PLAYMODE.sqeuence, // 播放模式
    currentIndex: 0, // 当前播放
    fullScreen: false // 是否全屏
  }),
  getters: {
    currentSong: (state) => state.playList[state.currentIndex]
  },
  actions: {
    setPlayState(playing: boolean): void {
      this.playing = playing
    },
    setSequenceList(list: []) {
      this.sequeceList = list
    },
    setPlayList(list: []) {
      this.playList = list
    },
    setPlayMode(mode: PLAYMODE) {
      this.playMode = mode
    },
    setCurrentIndex(index: number) {
      this.currentIndex = index
    },
    setFullScreen(fullscreen: boolean) {
      this.fullScreen = fullscreen
    },
    // 选择播放
    selectPlay({ list, index }: { list: [], index: number }) {
      this.setPlayMode(PLAYMODE.sqeuence)
      this.setSequenceList(list)
      this.setPlayState(true)
      this.setFullScreen(true)
      this.setPlayList(list) // 顺序播放
      this.setCurrentIndex(index)
    },

    randomPlay(list: []) {
      this.setPlayMode(PLAYMODE.random)
      this.setSequenceList(list)
      this.setPlayState(true)
      this.setFullScreen(true)
      this.setPlayList(shuffle(list)) // 顺序播放
      this.setCurrentIndex(0)
    }
  }
})
