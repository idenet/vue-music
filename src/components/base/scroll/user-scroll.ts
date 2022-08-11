import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef: any, options: any, emit: any) {
  const scroll = ref<BScroll | null>(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      ...options,
      observeDOM: true
    })

    if (options.probeType > 0) {
      scroll.value.on('scroll', (pos: any) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  return {
    scroll
  }
}
