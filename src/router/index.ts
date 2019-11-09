import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'menu',
      component: () => import('@/components/HomePage/index.vue')
    },
    {
      path: '/levels',
      name: 'levels',
      component: () => import('@/components/LevelMapPage/index.vue')
    },
    {
      path: '/level/:id',
      name: 'level',
      component: () => import('@/components/GamePage/index.vue')
    },
    {
      path: '/level/:id/:levelsaved',
      name: 'levelsaved',
      component: () => import('@/components/GamePage/index.vue'),
      meta: { levelSaved: true }
    },
    {
      path: '/info',
      component: () => import('@/components/EncyclopediaPage/index.vue'),
      children: [
        {
          path: '',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaDefaultArticle.vue')
        },
        {
          path: '/info/:entry',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaArticle.vue')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/RegisterPage/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/LoginPage/index.vue')
    },
    {
      path: '/myaccount',
      name: 'myaccount',
      component: () => import('@/components/MyAccountPage/index.vue')
    },
    {
      path: '/options',
      name: 'options',
      component: () => import('@/components/OptionsPage/index.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/components/NotFoundPage/index.vue')
    }
  ]
});
