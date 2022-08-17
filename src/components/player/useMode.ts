import { usePlayerStore, PLAYMODE } from '@/store'
import { computed } from 'vue'

export default function useMode() {
  const playerStore = usePlayerStore()

  const playMode = computed(() => playerStore.playMode)

  const modeIcon = computed(() => {
    const playModeV = playMode.value
    return playModeV === PLAYMODE.sequence
      ? 'icon-sequence'
      : playModeV === PLAYMODE.random
      ? 'icon-random'
      : 'icon-loop'
  })
  const modeText = computed(() => {
    const playModeV = playMode.value
    return playModeV === PLAYMODE.sequence
      ? '顺序播放'
      : playModeV === PLAYMODE.random
      ? '随机播放'
      : '单曲循环'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    playerStore.changeMode(mode)
  }

  return {
    modeIcon,
    changeMode,
    modeText,
  }
}
