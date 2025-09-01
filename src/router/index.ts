import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../pages/chat/index.vue'),
    },
    {
      path: '/webpage-preview',
      name: 'webpage-preview',
      component: () => import('../pages/webpage-preview/index.vue'),
    },
  ],
})

export default router
