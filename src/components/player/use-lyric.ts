import { computed, watch, ref, Ref } from 'vue'
import { usePlayerStore } from '../../store/index'
import { getLyric } from '../../service/song'
import { LyricType, SongType } from '../../types/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }: { songReady: Ref, currentTime: Ref }) {
  const currentLyric = ref<LyricType | null>(null)
  const currentLineNum = ref<number>(0)
  const lyricScrollRef = ref<any>(null)
  const lyricListRef = ref<HTMLDivElement | null>(null)
  const pureMusicLyric = ref<string>('')
  const playingLyric = ref<string>('')

  const store = usePlayerStore()
  const currentSong = computed(() => store.currentSong)

  watch(currentSong, async (newSong: SongType) => {
    if (!newSong.url || !newSong.id) return
    stopLyric() // 停止
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric: string = await getLyric(newSong)
    newSong.lyric = lyric
    store.addSongLyric({ song: newSong, lyric })

    if (currentSong.value.lyric !== lyric) return

    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value?.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  function handleLyric({ lineNum, txt }: { lineNum: number, txt: string }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEL = lyricListRef.value as HTMLDivElement
    if (!listEL) return
    if (lineNum > 5) {
      const lineEL = listEL.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEL, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  function playLyric() {
    const cLy = currentLyric.value
    if (cLy) {
      cLy.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const cLy = currentLyric.value
    if (cLy) {
      cLy.stop()
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric,
    pureMusicLyric,
    playingLyric
  }
}
