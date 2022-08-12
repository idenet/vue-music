<template>
  <div class="loading">
    <div class="loading-content">
      <img width="24" height="24" src="./loading.gif">
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
const title = ref<string>('正在加载中...')

function setTitle(text: string): void {
  title.value = text
}

defineExpose({
  setTitle
})
</script>

<script lang="ts">
export default {
  name: 'loading'
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
