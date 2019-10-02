import Vue from 'vue';
import Router from 'vue-router';
import Menu from './views/Menu.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('./views/Play.vue'),
    },
    {
      path: '/level/:id',
      name: 'level',
      component: () => import('./views/Level.vue'),
    },
    {
      path: '/levels',
      name: 'levels',
      component: () => import('./views/Levels.vue'),
    },
    {
      path: '/info/:id',
      name: 'ExampleElement',
      component: () => import('./components/ExampleElement.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue'),
    },
    {
      path: '*',
      name: '404',
      component: () => import('./views/NotFound.vue'),
    },
  ],
});
