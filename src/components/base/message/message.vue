<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineProps } from 'vue'

interface Props {
  delay?: number
}

const { delay = 2000 } = defineProps<Props>()

const visible = ref(false)
let timer: number

function show() {
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    hide()
  }, delay)
}

function hide() {
  clearTimeout(timer)
  visible.value = false
}

defineExpose({
  show,
})
</script>

<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;

  &.slide-down-enter-active,
  &.slide-down-leave-active {
    transition: all 0.3s;
  }

  &.slide-down-enter-from,
  &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
