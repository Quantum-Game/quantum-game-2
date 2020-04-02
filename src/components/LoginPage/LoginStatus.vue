<template>
  <div v-if="shown" class="login-status">
    <router-link :to="to" class="login-style">
      <p v-if="!isLoggedIn">LOG IN</p>
      <p v-else>Playing as {{ userName }}</p>
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
    return name !== 'login' && name !== 'home' && name !== 'rocks'
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
  top: 0;
  margin-right: 20px;
  margin-top: 10px;
  @media screen and (max-width: 800px) {
    display: none;
  }
}
p {
  color: white;
  font-size: 0.8rem;
  font-weight: 300;
  text-transform: none;
}
</style>
