<template>
  <div v-if="shown" class="login-status">
    <router-link :to="to">
      <app-button v-if="!moduleGetterIsLoggedIn">Click here to log in</app-button>
      <app-button v-else>Playing as {{ moduleGetterUserName }}</app-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppButton from '@/components/AppButton.vue'
import { namespace } from 'vuex-class'

const user = namespace('userModule')

@Component({
  components: {
    AppButton
  }
})
export default class LoginStatus extends Vue {
  @user.Getter('userName') moduleGetterUserName!: string
  @user.Getter('isLoggedIn') moduleGetterIsLoggedIn!: boolean
  /**
   * Dynamic route depending on context
   * @returns a route string
   */
  get to(): string {
    return this.moduleGetterIsLoggedIn ? '/myaccount' : '/login'
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
