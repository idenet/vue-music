<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { getSingerDetail } from '../service/singer'
import MusicList from '@/components/music-list/music-list.vue'
import useCreateDetailComponent from '../assets/js/create-detail-component'
import { SINGER_KEY } from '@/assets/js/constant'
import { SingerType } from '@/types/singers'

interface singerT {
  data: SingerType
}

const props = defineProps<singerT>()

const { songs, pic, title, loading } = useCreateDetailComponent(
  props,
  SINGER_KEY,
  getSingerDetail
)
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
