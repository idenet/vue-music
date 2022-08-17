import { defineStore } from 'pinia'
import { SongType } from '../types/song'
import { shuffle } from '../assets/js/util'
import { load } from '../assets/js/array-store'
import { FAVORATE_KEY } from '../assets/js/constant'

export enum PLAYMODE {
  sequence = 0,
  loop = 1,
  random = 2,
}

interface PlayerType {
  sequeceList: SongType[] // 歌曲列表
  playList: SongType[] // 真实的播放列表
  playing: boolean // 播放状态
  playMode: PLAYMODE // 播放模式
  currentIndex: number // 当前播放
  fullScreen: boolean // 是否全屏
  favoriteList: SongType[]
}

// 播放的store
export const usePlayerStore = defineStore('player', {
  state: (): PlayerType => ({
    sequeceList: [], // 歌曲列表
    playList: [], // 真实的播放列表
    playing: false, // 播放状态
    playMode: PLAYMODE.sequence, // 播放模式
    currentIndex: 0, // 当前播放
    fullScreen: false, // 是否全屏
    favoriteList: load(FAVORATE_KEY),
  }),
  getters: {
    currentSong: (state) => state.playList[state.currentIndex] || {},
    fullScreenGetter: (state) => state.fullScreen,
  },
  actions: {
    setPlayState(playing: boolean): void {
      this.playing = playing
    },
    setSequenceList(list: SongType[]) {
      this.sequeceList = list
    },
    setPlayList(list: SongType[]) {
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
    setFavoriteList(list: SongType[]) {
      this.favoriteList = list
    },
    // 选择播放
    selectPlay({ list, index }: { list: SongType[]; index: number }) {
      this.setPlayMode(PLAYMODE.sequence)
      this.setSequenceList(list)
      this.setPlayState(true)
      this.setFullScreen(true)
      this.setPlayList(list) // 顺序播放
      this.setCurrentIndex(index)
    },

    randomPlay(list: SongType[]) {
      this.setPlayMode(PLAYMODE.random)
      this.setSequenceList(list)
      this.setPlayState(true)
      this.setFullScreen(true)
      this.setPlayList(shuffle(list)) // 顺序播放
      this.setCurrentIndex(0)
    },

    changeMode(mode: PLAYMODE) {
      const currentId = this.currentSong.id
      if (mode === PLAYMODE.random) {
        this.setPlayList(shuffle(this.sequeceList))
      } else {
        this.setPlayList(this.sequeceList)
      }
      const index = this.playList.findIndex((song) => song.id === currentId)
      console.log(index)
      this.setCurrentIndex(index)
      this.setPlayMode(mode)
    },
    addSongLyric({ song, lyric }: { song: SongType; lyric: string }) {
      this.sequeceList.map((item) => {
        if (item.mid === song.mid) {
          item.lyric = lyric
        }
        return item
      })
    },
    removeSong(song: SongType) {
      const sequenceList = this.sequeceList.slice()
      const playlist = this.playList.slice()

      const sequenceIndex = findIndex(sequenceList, song)
      const playIndex = findIndex(playlist, song)
      if (playIndex < 0) return

      sequenceList.splice(sequenceIndex, 1)
      playlist.splice(playIndex, 1)
      let currentIndex = this.currentIndex
      if (playIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--
      }

      this.setSequenceList(sequenceList)
      this.setPlayList(playlist)
      this.setCurrentIndex(currentIndex)
      if (!playlist.length) {
        this.setPlayState(false)
      }
    },
    clearSongList() {
      this.setSequenceList([])
      this.setPlayList([])
      this.setCurrentIndex(0)
      this.setPlayState(false)
    },
  },
})

function findIndex(list: SongType[], song: SongType) {
  return list.findIndex((item) => item.id === song.id)
}
