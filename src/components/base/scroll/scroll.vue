<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
import { ref, defineProps, defineEmits, defineExpose } from 'vue'
import useScroll from './user-scroll'

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})

const rootRef = ref(null)

const emit = defineEmits(['scroll'])

const { scroll } = useScroll(rootRef, props, emit)

defineExpose({
  scroll
})
</script>

<style lang='scss' scoped>
</style>
