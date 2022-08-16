<template>
  <div class="progress-bar" ref="propgressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div class="progress-btn-wrapper" :style="btnStyle" @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove" @touchend.prevent="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { computed, defineProps, ref, watch, defineEmits, defineExpose } from 'vue'

interface Props {
  progress: number
}

const progressBtnWidth = 16

const props = defineProps<Props>()
const emit = defineEmits(['progress-changing', 'progress-changed'])

const offset = ref<number>(0)
const propgressBarRef = ref<HTMLDivElement | null>(null)
const progressRef = ref<HTMLDivElement | null>(null)

const progressStyle = computed(() => `width:${offset.value}px`)
const btnStyle = computed(() => `transform:translate3d(${offset.value}px, 0, 0)`)

watch(() => props.progress, (newProgress) => {
  setOffset(newProgress)
})

interface TouchType {
  x1: number
  beginWidth: number
}

const touch: TouchType = {
  x1: 0,
  beginWidth: 0
}

function onTouchStart(e: TouchEvent) {
  touch.x1 = e.touches[0].pageX
  touch.beginWidth = progressRef.value?.clientWidth as number
}

function onTouchMove(e: TouchEvent) {
  const delta = e.touches[0].pageX - touch.x1
  const tempWidth = touch.beginWidth + delta
  const barWidth = propgressBarRef.value?.clientWidth as number - progressBtnWidth
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
  offset.value = barWidth * progress
  emit('progress-changing', progress)
}

function onTouchEnd() {
  const barWidth = propgressBarRef.value?.clientWidth as number - progressBtnWidth
  const progress = progressRef.value?.clientWidth as number / barWidth
  emit('progress-changed', progress)
}

function onClick(e: any) {
  const rect: DOMRect = propgressBarRef.value?.getBoundingClientRect() as DOMRect
  const offsetWidth = e.pageX - rect.left
  const barWidth = propgressBarRef.value?.clientWidth as number - progressBtnWidth
  const progress = offsetWidth / barWidth
  emit('progress-changed', progress)
}

function setOffset(progress: number) {
  const propressRef = propgressBarRef.value as HTMLDivElement
  const barWidth = propressRef.clientWidth - progressBtnWidth
  offset.value = barWidth * progress
}

defineExpose({
  setOffset
})
</script>

<style lang='scss' scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
