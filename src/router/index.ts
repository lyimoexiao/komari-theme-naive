import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

router.beforeEach(() => {
  window.$loadingBar.start()
})

router.afterEach(() => {
  window.$loadingBar.finish()
})

export default router
