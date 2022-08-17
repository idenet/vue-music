<template>
  <div class="singer" v-loading="!singers.length">
    <indexListVue @select="selectSinger" :singers="singers"></indexListVue>
    <!-- <router-view :singer="selectedSinger"></router-view> -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { getSingerList } from '@/service/singer'
import { onMounted, ref } from 'vue'
import indexListVue from '@/components/index-list/index-list.vue'
import { SingersType, SingerType } from '../types/singers'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '../assets/js/constant'

const singers = ref<SingersType[]>([])
const selectedSinger = ref<SingerType | null>(null)

const router = useRouter()

onMounted(() => {
  _getSingerList()
})

function selectSinger(singer: SingerType) {
  selectedSinger.value = singer
  cacheSinger(singer)
  router.push({
    path: `/singer/${singer.mid}`,
  })
}

async function _getSingerList() {
  const result = await getSingerList()
  singers.value = result.singers
}

function cacheSinger(singer: SingerType) {
  storage.session.set(SINGER_KEY, singer)
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
