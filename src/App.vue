<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MHeader from './components/MHeader/MHeader.vue'
import MTab from './components/MTab/MTab.vue'
import player from './components/player/player.vue'
</script>

<template>
  <MHeader></MHeader>
  <MTab></MTab>
  <router-view></router-view>
  <player></player>
</template>
