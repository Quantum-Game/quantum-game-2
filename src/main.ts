import Vue from 'vue';
import Donut from 'vue-css-donut-chart';
import VueConfetti from 'vue-confetti';
import 'vue-css-donut-chart/dist/vcdonut.css';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './registerServiceWorker';
import '@/config/firebase';

Vue.use(Donut);
Vue.use(VueConfetti);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
