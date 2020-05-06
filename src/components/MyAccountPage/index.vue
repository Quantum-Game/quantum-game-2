<template>
  <app-layout>
    <div slot="main">
      <h1>My Account</h1>
      <h2>Hi {{ moduleGetterUserName }}!</h2>
      <p>User page is under construction. Right now, see:</p>
      <router-link to="/savedlevels"
        ><app-button> Saved and shared levels </app-button>
      </router-link>
      <div class="signOut">
        <a @click.prevent="signOut">Sign Out</a>
      </div>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

const user = namespace('userModule')

@Component({
  components: {
    AppLayout,
    AppButton,
  },
})
export default class MyAccount extends Vue {
  @user.Action('SIGN_OUT') actionSignOut!: Function
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
.levels-progress {
  list-style: none;
  li {
    margin: 5px auto;
  }
}
.edit-level {
  cursor: pointer;
  border: 1px solid #fff;
  margin: 10px;
}
.signOut {
  margin: 20px 10px 10px 10px;
}
</style>
