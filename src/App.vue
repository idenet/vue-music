<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MHeader from './components/MHeader/MHeader.vue'
import MTab from './components/MTab/MTab.vue'
import player from './components/player/player.vue'
import { computed } from 'vue'
import { usePlayerStore } from './store/index'

const store = usePlayerStore()

const viewStyle = computed(() => {
  const bottom = store.playList.length ? '60px' : '0'
  return {
    bottom,
  }
})
</script>

<template>
  <MHeader></MHeader>
  <MTab></MTab>
  <router-view :style="viewStyle"></router-view>
  <player></player>
</template>
