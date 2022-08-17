import Loading from './components/base/loading/loading.vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    LoadingType: typeof Loading
  }
}
