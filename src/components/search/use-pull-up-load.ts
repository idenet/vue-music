import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(
  requestData: any,
  preventPullUpLoad: any
) {
  const scroll = ref<any>(null)
  const rootRef = ref<HTMLDivElement | null>(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(
      rootRef.value as HTMLDivElement,
      {
        pullUpLoad: true,
        observeDOM: true,
        click: true,
      }
    ))
    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destory()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad,
  }
}
