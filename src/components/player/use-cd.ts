import { usePlayerStore } from '@/store'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const store = usePlayerStore()

  const cdRef = ref<HTMLDivElement | null>(null)
  const cdImageRef = ref<HTMLImageElement | null>(null)

  const playing = computed(() => store.playing)

  const cdCls = computed(() => playing.value ? 'playing' : '')

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value as HTMLDivElement, cdImageRef.value as HTMLImageElement)
    }
  })

  function syncTransform(wrapper: HTMLDivElement, inner: HTMLImageElement) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
