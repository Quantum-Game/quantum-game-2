<template>
  <app-layout>
    <template v-slot:main>
      <h1>My Account</h1>
      <h2>Hi {{ moduleGetterUserName }}!</h2>
      <p>User page is under construction. Right now, see:</p>
      <router-link to="/savedlevels"
        ><app-button> Saved and shared levels </app-button>
      </router-link>
      <div class="signOut">
        <a @click.prevent="signOut">Sign Out</a>
      </div>
    </template>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { namespace } from 'vuex-class'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import { ActionMethod } from 'vuex'

const user = namespace('userModule')

@Options({
  components: {
    AppLayout,
    AppButton,
  },
})
export default class MyAccount extends Vue {
  @user.Action('SIGN_OUT') actionSignOut!: ActionMethod
  @user.Getter('userName') moduleGetterUserName!: string

  signOut(): void {
    this.actionSignOut(this.moduleGetterUserName)
  }
}
</script>

<style lang="scss" scoped>
h1 {
  color: white;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 150%;
  text-transform: uppercase;
}
h2 {
  margin-top: 80px;
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 150%;
  // text-transform: uppercase;
}
.signOut {
  margin: 20px 10px 10px 10px;
}
</style>
