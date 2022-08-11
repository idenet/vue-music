import { SingersType } from '@/types/singers'
import { nextTick, ref, watch, computed } from 'vue'

interface Props {
  singers: SingersType[]
}

export default function useFixed(props: Props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref<Element | null>(null)
  const listHeights = ref<number[]>([])
  const scrollY = ref<number>(0)
  const currentIndex = ref<number>(0)
  // 距离
  const distance = ref<number>(0)

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.singers[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceValue = distance.value
    const diff = (distanceValue > 0 && distanceValue < TITLE_HEIGHT) ? distanceValue - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  watch(() => props.singers, async () => {
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY < heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    const list = groupRef.value?.children as HTMLCollection
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  function onScroll(pos: any) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
