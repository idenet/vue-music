<template>
  <div class="top-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    ></music-list>
  </div>
</template>

<script lang="ts" setup>
import MusicList from '@/components/music-list/music-list.vue'
import { topListType } from '@/types/topList'
import { defineProps } from 'vue'
import useCreateDetailComponent from '../assets/js/create-detail-component'
import { TOP_KEY } from '../assets/js/constant'
import { getTopDetail } from '../service/top-list'

interface singerT {
  data: topListType
}

const props = defineProps<singerT>()

const { songs, pic, title, loading } = useCreateDetailComponent(
  props,
  TOP_KEY,
  getTopDetail
)
</script>

<style lang="scss" scoped>
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
