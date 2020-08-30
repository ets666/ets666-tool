import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'find-file',
      component: require('@/views/find-file.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
