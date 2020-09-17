import { createRouter, createWebHistory } from 'vue-router'

/* eslint-disable */
export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomePage/index.vue'),
      meta: {
        preventSound: true,
      },
    },
    {
      path: '/levels',
      name: 'levels',
      component: () => import('@/components/LevelMapPage/index.vue'),
    },
    {
      path: '/level/:username/:id/',
      name: 'sharedlevels',
      component: () => import('@/components/GamePage/index.vue'),
      meta: {
        shared: true,
      },
    },
    {
      path: '/level/:id',
      name: 'level',
      component: () => import('@/components/GamePage/index.vue'),
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('@/components/GamePage/index.vue'),
    },
    {
      path: '/info',
      component: () => import('@/components/EncyclopediaPage/index.vue'),
      children: [
        {
          path: '',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaDefaultArticle.vue'),
        },
        {
          path: '/info/:entry',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaArticle.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/RegisterPage/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/LoginPage/index.vue'),
    },
    {
      path: '/myaccount',
      name: 'myaccount',
      component: () => import('@/components/MyAccountPage/index.vue'),
    },
    {
      path: '/savedlevels',
      name: 'savedlevels',
      component: () => import('@/components/SavedLevelsPage/index.vue'),
    },
    {
      path: '/options',
      name: 'options',
      component: () => import('@/components/OptionsPage/index.vue'),
    },
    {
      path: '/rocks/:id',
      name: 'rocks',
      component: () => import('@/components/RockTalkPage/index.vue'),
    },
    {
      path: '/dev/rock_talk',
      component: () => import('@/components/RockTalkPage/RockDemo.vue'),
    },
    {
      path: '/dev/cells',
      component: () => import('@/components/RockTalkPage/CellsDemo.vue'),
    },
    {
      path: '/*',
      name: '404',
      component: () => import('@/components/NotFoundPage/index.vue'),
    },
  ],
})
/* eslint-enable */
