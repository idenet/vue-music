import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import lazyPlugin from 'vue3-lazy'
import loadingirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
// 引入全局样式文件
import '@/assets/scss/index.scss'
import { load, saveAll } from './assets/js/array-store'
import { FAVORATE_KEY, PLAY_KEY } from './assets/js/constant'
import { processSongs } from './service/song'
import { usePlayerStore } from './store/index'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png'),
  })
  .directive('loading', loadingirective)
  .directive('no-result', noResultDirective)
  .mount('#app')

const store = usePlayerStore()

const favoriteSongs = load(FAVORATE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.setFavoriteList(songs)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.setPlayHistory(songs)
    saveAll(songs, PLAY_KEY)
  })
}
