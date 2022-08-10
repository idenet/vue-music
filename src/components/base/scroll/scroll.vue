<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
import { ref, defineProps } from 'vue'
import useScroll from './user-scroll'

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  }
})

const rootRef = ref(null)

useScroll(rootRef, props)

</script>

<style lang='scss' scoped>

</style>
