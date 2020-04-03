<template>
  <div v-if="shown" class="login-status">
    <router-link :to="to" class="login-style">
      <p v-if="!moduleGetterIsLoggedIn">LOG IN</p>
      <p v-else>Playing as {{ moduleGetterUserName }}</p>
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
    return name !== 'login' && name !== 'home' && name !== 'rocks'
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
