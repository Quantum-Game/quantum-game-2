<template>
  <app-layout>
    <div slot="main" class="login-page-wrapper">
      <h1>
        User Login
      </h1>
      <p>Login with your social account</p>
      <div class="social-login">
        <div class="social-login__btn social-login__gh" @click="signInGithub">Github</div>
        <div class="social-login__btn social-login__fb " @click="signInFacebook">
          Facebook
        </div>
        <div class="social-login__btn social-login__g" @click="signInGoogle">Google</div>
      </div>
      <p class="separator">or</p>
      <div v-if="error" class="alert-error">{{ error }}</div>
      <form class="email-login" action="#" @submit.prevent="signIn">
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
            <input v-model="user.rememberMe" type="checkbox" checked name="rememberme" />
            <label for="rememberme">Remember Me</label>
          </div>
          <app-button type="special"> Login </app-button>
        </div>
      </form>
      <p>Forgot your password?</p>
      <p>Don't have an account? <router-link to="/register"> Sign Up </router-link></p>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import $userStore from '@/store/userStore'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

@Component({
  components: {
    AppLayout,
    AppButton
  }
})
export default class Login extends Vue {
  user: {} = {
    email: '',
    password: '',
    rememberMe: true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get error(): any {
    return $userStore.getters.error
  }

  signIn(): void {
    $userStore.dispatch('SIGN_IN', this.user)
  }

  signInGithub(): void {
    $userStore.dispatch('SIGN_IN_GITHUB')
  }

  signInFacebook(): void {
    $userStore.dispatch('SIGN_IN_FACEBOOK')
  }

  signInGoogle(): void {
    $userStore.dispatch('SIGN_IN_GOOGLE')
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
}

.alert-error {
  margin-bottom: 20px;
  color: #ff0055;
}

.separator {
  position: relative;
}

.separator::before,
.separator::after {
  content: '';
  position: absolute;
  border-top: 2px solid #fff;
  width: 45%;
  top: 50%;
  right: 55%;
}

.separator::after {
  left: 55%;
}

.social-login__btn {
  width: 100%;
  padding: 10px 0;
  margin-bottom: 5px;
  cursor: pointer;
}

.social-login {
  &__gh {
    background: #120223;
  }
  &__fb {
    background: #39579a;
  }
  &__g {
    background: #4285f4;
  }
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
