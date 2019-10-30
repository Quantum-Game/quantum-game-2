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
			component: () => import('./views/MainMenu.vue')
		},
		{
			path: '/levels',
			name: 'levels',
			component: () => import('./views/Levels.vue')
		},
		{
			path: '/level/:id',
			name: 'level',
			component: () => import('./views/Game.vue')
		},
		{
			path: '/info',
			component: () => import('./views/Info.vue'),
			children: [
				{
					path: '',
					component: () => import('./info/InfoHome.vue')
				},
				{
					path: '/info/:entry',
					component: () => import('./info/Entry.vue')
				}
			]
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('./views/Register.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('./views/Login.vue')
		},
		{
			path: '/myaccount',
			name: 'myaccount',
			component: () => import('./views/MyAccount.vue')
		},
		{
			path: '*',
			name: '404',
			component: () => import('./views/NotFound.vue')
		}
	]
});
