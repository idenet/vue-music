import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: () => import('@/views/Recommend.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/album.vue'),
      },
    ],
  },
  {
    path: '/singer',
    component: () => import('@/views/Singer.vue'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/singer-detail.vue'),
      },
    ],
  },
  {
    path: '/top-list',
    component: () => import('@/views/TopList.vue'),
  },
  {
    path: '/search',
    component: () => import('@/views/Search.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
