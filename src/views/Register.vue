<template>
	<main-layout>
		<div slot="main" class="login-page-wrapper">
			<h1>
				User Registration
			</h1>
			<div v-if="error" class="alert alert-danger">{{ error }}</div>
			<form class="email-login" action="#" @submit.prevent="submit">
				<div class="col-md-6">
					<input
						id="name"
						v-model="user.name"
						type="name"
						class="form-control"
						name="name"
						value
						required
						autofocus
						placeholder="Name"
					/>
				</div>
				<div class="email-login__email">
					<input
						id="email"
						v-model="user.email"
						type="email"
						class="form-control"
						name="email"
						value
						required
						autofocus
						placeholder="Email"
					/>
				</div>
				<div class="email-login__password">
					<input
						id="password"
						v-model="user.password"
						type="password"
						class="form-control"
						name="password"
						required
						placeholder="Password"
					/>
				</div>
				<div class="login-button-wrapper">
					<div class="rememberme">
						<input type="checkbox" name="rememberme" />
						<label for="rememberme">Remember Me</label>
					</div>
					<q-button type="special"> Sign Up </q-button>
				</div>
			</form>
			<p>Forgot your password?</p>
			<p>You have an account?<router-link to="/login"> Sign In </router-link></p>
		</div>
	</main-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import firebase from 'firebase';
import MainLayout from '../layouts/MainLayout.vue';
import QButton from '../components/QButton.vue';

@Component({
	components: {
		MainLayout,
		QButton
	}
})
export default class Register extends Vue {
	user: {} = {
		email: '',
		password: '',
		name: ''
	};
	error: string = '';

	submit() {
		firebase
			.auth()
			.createUserWithEmailAndPassword(this.user.email, this.user.password)
			.then((data) => {
				data.user.updateProfile({
					displayName: this.user.name
				});
			})
			.then((data) => {
				this.$router.replace({ name: 'myaccount' });
			})
			.catch((err) => {
				this.error = err.message;
			});
	}
}
</script>

<style lang="scss" scoped>
.login-page-wrapper {
	max-width: 320px;
	margin: 80px auto 0;
}
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

input[type='email'],
input[type='name'],
input[type='password'] {
	outline: none;
	display: inline-block;
	width: 100%;
	padding: 10px;
	background: #fff;
	border-top: none;
	border-right: none;
	border-left: none;
	border-bottom: none;
	box-sizing: border-box;
	color: #000;
	font-size: 1rem;
	font-weight: normal;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	-o-box-sizing: border-box;
	-ms-box-sizing: border-box;
	margin-bottom: 5px;
}

input[type='email']:focus,
input[type='name']:focus,
input[type='password']:focus {
	color: #000;
	font-family: Montserrat, Arial, Helvetica, sans-serif;
	font-size: 1rem;
	font-weight: normal;
	border-top: none;
	border-right: none;
	border-left: none;
	border-bottom: none;
	box-sizing: border-box;
}

::placeholder {
	color: rgba(0, 0, 0, 0.4);
	font-family: Montserrat, Arial, Helvetica, sans-serif;
	text-align: center;
}
.login-button-wrapper {
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	margin-top: 25px;
}

.rememberme label {
	font-size: 1rem;
	color: rgba(255, 255, 255, 0.7);
}

@media screen and (max-width: 736px) {
	input[type='email']:focus,
	input[type='password']:focus {
		width: 100%;
	}
}
</style>
