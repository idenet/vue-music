import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef:any, options: any) {
  const scroll = ref<BScroll | null>(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      ...options,
      observeDOM: true
    })
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })
}
