import { SingersType } from '@/types/singers'
import { computed, ref, Ref } from 'vue'

interface Props {
  singers: SingersType[]
}

interface elType extends HTMLDivElement {
  dataset: {
    index: string
  }
}

interface TouchType {
  y1: number
  y2: number,
  anchorIndex: number
}

export default function useShortcut(props: Props, groupRef: Ref) {
  const ANCHOR_HEIGHT = 18

  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.singers.map((group) => group.title)
  })

  const touch: TouchType = {
    y1: 0,
    y2: 0,
    anchorIndex: 0
  }

  function onShortcutTouchStart(e: TouchEvent) {
    const anchorIndex = parseInt((e.target as elType).dataset.index)

    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e: TouchEvent) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index: number) {
    // index 无效
    if (isNaN(index)) return

    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetRl = groupRef.value.children[index]

    const scroll = (scrollRef.value as any).scroll

    scroll.scrollToElement(targetRl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    scrollRef
  }
}
