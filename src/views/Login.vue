<template>
	<main-layout>
		<div slot="main" class="login-page-wrapper">
			<h1>
				User Login
			</h1>
			<p>Login with your social account</p>
			<div class="social-login">
				<div class="social-login__btn social-login__gh">Github</div>
				<div class="social-login__btn social-login__fb">Facebook</div>
				<div class="social-login__btn social-login__g">Google</div>
			</div>
			<p class="separator">or</p>
			<div v-if="error" class="alert alert-danger">{{ error }}</div>
			<form class="email-login" action="#" @submit.prevent="submit">
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
						placeholder="email"
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
						placeholder="password"
					/>
				</div>
				<div class="login-button-wrapper">
					<div class="rememberme">
						<input type="checkbox" name="rememberme" />
						<label for="rememberme">Remember Me</label>
					</div>
					<q-button type="special"> Login </q-button>
				</div>
			</form>
			<p>Forgot your password?</p>
			<p>Don't have an account?<router-link to="/register"> Sign Up </router-link></p>
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
export default class Login extends Vue {
	user: {} = {
		email: '',
		password: ''
	};
	error: string = '';

	submit() {
		firebase
			.auth()
			.signInWithEmailAndPassword(this.user.email, this.user.password)
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

.social-login__btn {
	width: 100%;
	padding: 10px 0;
	border: 1px solid #fff;
	margin-bottom: 5px;
	cursor: pointer;
}

input[type='email'],
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
