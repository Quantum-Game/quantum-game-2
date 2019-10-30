<template>
	<main-layout>
		<div slot="main">
			<h1>My Account</h1>
			<h2>Hello, {{ user }}</h2>
			<q-button type="special"> <a @click.prevent="signOut">Sign Out!</a> </q-button>
		</div>
	</main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import firebase from 'firebase';
import $userStore from '@/store/userStore';
import MainLayout from '../layouts/MainLayout.vue';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		MainLayout,
		QButton
	}
})
export default class MyAccount extends Vue {
	error: string = '';

	get user() {
		return $userStore.getters.userName;
	}

	signOut() {
		console.log(this);
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.$router.replace({
					name: 'login'
				});
			});
	}
}
</script>

<style lang="scss" scoped>
h1 {
	color: white;
	font-size: 2rem;
	font-weight: normal;
	line-height: 150%;
	text-transform: uppercase;
}
p {
	color: rgba(255, 255, 255, 0.7);
	// line-height: 150%;
}
</style>
