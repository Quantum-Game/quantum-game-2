<template>
  <div v-if="shown" class="login-status">
    <router-link v-if="!loggedIn" to="/login" class="login-style">
      <p>LOG IN</p>
    </router-link>
    <router-link v-else to="/myaccount" class="login-style"
      ><p>Playing as {{ userName }}</p>
    </router-link>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { computed, defineComponent } from 'vue'
import { storeNamespace } from '@/store'

export default defineComponent({
  setup() {
    const route = useRoute()
    const user = storeNamespace('user')
    const moduleGetterUserName = user.useGetter('userName')
    const moduleGetterIsLoggedIn = user.useGetter('isLoggedIn')

    return {
      userName: moduleGetterUserName,
      loggedIn: moduleGetterIsLoggedIn,
      /**
       * The button should not be displayed on a login page
       * nor the home page
       * @returns shown boolean
       */
      shown: computed(() => {
        const name = route.name
        return name !== 'login' && name !== 'home' && name !== 'rocks'
      }),
    }
  },
})
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
