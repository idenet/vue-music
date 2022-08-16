import { ref } from 'vue'

interface TouchType {
  startX: number,
  startY: number,
  percent: number,
  directionLock: string
}

export default function useMiddleInteractive() {
  const currentShow = ref<string>('cd')
  const middleRStyle = ref<any>(null)
  const middleLStyle = ref<any>(null)

  const touch: TouchType = {
    startX: 0,
    startY: 0,
    percent: 0,
    directionLock: ''
  }
  let currentView = 'cd'

  function onMiddleTouchStart(e: TouchEvent) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
  }

  function onMiddleTouchMove(e: TouchEvent) {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltax = Math.abs(deltaX)
    const absDeltay = Math.abs(deltaY)

    if (!touch.directionLock) {
      touch.directionLock = absDeltax >= absDeltay ? 'h' : 'v'
    }

    if (touch.directionLock === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 限制到 0 至 window.innerwidth之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity

    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
