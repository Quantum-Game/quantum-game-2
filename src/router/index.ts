import { levelIdFromString, LevelKind } from '@/assets/data/levels'
import { isEqual } from 'lodash'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
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
      path: '/level/:id',
      name: 'level',
      component: () => import('@/components/GamePage/index.vue'),
      props: (route) => {
        return {
          levelId: levelIdFromString(route.params.id as string),
        }
      },
    },
    {
      path: '/lab',
      name: 'lab',
      component: () => import('@/components/GamePage/index.vue'),
      props: { levelId: { kind: LevelKind.Lab } },
    },
    {
      path: '/info',
      component: () => import('@/components/EncyclopediaPage/index.vue'),
      children: [
        {
          path: '',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaMainPage.vue'),
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
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/components/NotFoundPage/index.vue'),
    },
  ],
})

// preserve feature flags in the route
router.beforeEach((to, from, next) => {
  const mergedQuery = { ...from.query, ...to.query }
  if (!isEqual(to.query, mergedQuery)) {
    next({ ...to, query: { ...from.query, ...to.query } })
  } else {
    next()
  }
})

export default router
