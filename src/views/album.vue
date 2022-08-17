<template>
  <div class="album">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script lang="ts" setup>
import { SingerType } from '@/types/singers'
import MusicList from '@/components/music-list/music-list.vue'
import useCreateDetailComponent from '../assets/js/create-detail-component'
import { ALBUM_KEY } from '../assets/js/constant'
import { getAlbum } from '../service/recommend'
import { defineProps } from 'vue'

interface singerT {
  data: SingerType
}

const props = defineProps<singerT>()

const { songs, pic, title, loading } = useCreateDetailComponent(
  props,
  ALBUM_KEY,
  getAlbum
)
</script>

<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
