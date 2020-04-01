<template>
  <div v-if="shown" class="login-status">
    <router-link :to="to">
      <app-button v-if="!isLoggedIn">Click here to log in</app-button>
      <app-button v-else>Playing as {{ userName }}</app-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '@/components/AppButton.vue'
import $userStore from '@/store/userStore'

@Component({
  components: {
    AppButton
  }
})
export default class LoginStatus extends Vue {
  /**
   * Dynamic route depending on context
   * @returns a route string
   */
  get to(): string {
    return this.isLoggedIn ? '/myaccount' : '/login'
  }

  /**
   * The button should not be displayed on a login page
   * nor the home page
   * @returns shown boolean
   */
  get shown(): boolean {
    const { name } = this.$route
    return name !== 'login' && name !== 'home'
  }

  // TODO: could be done with mapGetters vuex helper,
  // but $userStore would need to be turned into a
  // regular, namespaced module
  /**
   * @returns isLoggedIn store boolean
   */
  get isLoggedIn(): boolean {
    return $userStore.getters.isLoggedIn
  }

  /**
   * @returns userName store string
   */
  get userName(): string {
    return $userStore.getters.userName
  }
}
</script>

<style lang="scss" scoped>
// TODO: make it a display: sticky for views that scroll
.login-status {
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
