import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/index/index.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Home
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
