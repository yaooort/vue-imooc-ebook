import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    {
      // 阅读器主页
      path: '/ebook',
      component: () => import('./views/ebook/index.vue'),
      children: [
        {
          path: ':fileName',
          component: () => import('./components/ebook/EbookReader.vue')
        }
      ]
    },
    {
      // 书城主页
      path: '/store',
      component: () => import('./views/store/index.vue'),
      redirect: '/store/home',
      children: [
        {
          path: 'home',
          component: () => import('./views/store/StoreHome.vue')
        }
      ]
    }
  ]
})
