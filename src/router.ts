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
					component: () => import('./entries/InfoHome.vue')
				},
				{
					path: '/info/:entry',
					component: () => import('./entries/Entry.vue')
				}
			]
		},
		{
			path: '*',
			name: '404',
			component: () => import('./views/NotFound.vue')
		}
	]
});
