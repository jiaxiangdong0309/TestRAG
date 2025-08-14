import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/search'
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../pages/search/index.vue'),
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('../pages/knowledge/index.vue'),
    },
    {
      path: '/local',
      name: 'local',
      component: () => import('../pages/local/index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/about/index.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/profile/index.vue'),
    },
    {
      path: '/style-guide',
      name: 'style-guide',
      component: () => import('../pages/style-guide/index.vue'),
    },
    {
      path: '/api-test',
      name: 'api-test',
      component: () => import('../pages/api-test/index.vue'),
    },
    {
      path: '/dify-sse',
      name: 'dify-sse',
      component: () => import('../pages/dify-sse/index.vue'),
    },
  ],
})

export default router
