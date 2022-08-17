import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { usePlayerStore } from '../../store/index'
import Slider from '@better-scroll/slide'
import BScroll from '@better-scroll/core'

BScroll.use(Slider)

export function useMiniSlider() {
  const sliderWrapperRef = ref<HTMLDivElement | null>(null)
  const slider = ref<BScroll | null>(null)

  const store = usePlayerStore()

  const fullScreen = computed(() => store.fullScreen)
  const playlist = computed(() => store.playList)
  const currentIndex = computed(() => store.currentIndex)

  const sliderShow = computed(() => !fullScreen.value && !!playlist.value)

  onMounted(() => {
    let sliderV: BScroll
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderV) {
          sliderV = slider.value = new BScroll(
            sliderWrapperRef.value as HTMLDivElement,
            {
              click: true,
              scrollX: true,
              scrollY: false,
              momentum: false,
              bounce: false,
              probeType: 2,
              slide: {
                autoplay: false,
                loop: true,
              },
            }
          )
          sliderV.on('slidePageChanged', ({ pageX }: { pageX: number }) => {
            store.setCurrentIndex(pageX)
          })
        } else {
          sliderV.refresh()
        }
        sliderV.goToPage(currentIndex.value, 0, 0)
      }
    })

    watch(currentIndex, (newIndex) => {
      if (sliderV && sliderShow.value) {
        sliderV.goToPage(newIndex, 0, 0)
      }
    })

    watch(playlist, async (newlist) => {
      if (sliderV && sliderShow.value && newlist.length) {
        await nextTick()
        sliderV.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    sliderWrapperRef,
  }
}
