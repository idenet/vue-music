import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import lazyPlugin from 'vue3-lazy'
import loadingirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
  })
  .directive('loading', loadingirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
