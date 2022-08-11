<template>
  <div class="singer" v-loading="!singers.length">
    <indexListVue :singers="singers"></indexListVue>
  </div>
</template>

<script lang='ts' setup>
import { getSingerList } from '@/service/singer'
import { onMounted, ref } from 'vue'
import indexListVue from '@/components/base/index-list/index-list.vue'
import { SingersType } from '../types/singers'

const singers = ref<SingersType[]>([])

onMounted(() => {
  _getSingerList()
})

async function _getSingerList() {
  const result = await getSingerList()
  singers.value = result.singers
}
</script>

<style lang='scss' scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
