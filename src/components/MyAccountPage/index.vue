<template>
  <app-layout>
    <div slot="main">
      <h1>My Account</h1>
      <h2>Hello {{ moduleGetterUserName }}</h2>
      <div>
        <label>Status: </label>
        <input v-model="level.status" type="text" />
        <label> Score: </label>
        <input v-model="level.score" type="text" />
      </div>
      <br />
      <br />
      <ul class="levels-progress">
        <li v-for="(lvl, index) in moduleGettrProgressArr" :key="index">
          Level: {{ lvl.id }} Status: {{ lvl.status }} Score: {{ lvl.score }}
          <span class="edit-level" @click="editLevel(lvl)"> >>>> Edit</span>
        </li>
      </ul>
      <a @click.prevent="saveProgressToDB"
        ><app-button type="special"> Save data to Firestore!!! </app-button></a
      >
    </div>
    <div slot="right">
      <a @click.prevent="signOut"><app-button type="special"> Sign Out </app-button></a>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

const user = namespace('userModule')

interface IAccountLevel {
  id: number
  status: ''
  score: number
}

@Component({
  components: {
    AppLayout,
    AppButton
  }
})
export default class MyAccount extends Vue {
  @user.Mutation('SET_PROGRESS') mutationSetProgress!: Function
  @user.Action('SET_INITIAL_PROGRESS') actionSetInitialProgress!: Function
  @user.Action('SAVE_PROGRESS') actionSaveProgress!: Function
  @user.Action('SIGN_OUT') actionSignOut!: Function
  @user.Getter('progressArr') moduleGettrProgressArr!: []
  @user.Getter('userName') moduleGetterUserName!: string
  level = {
    id: 0,
    status: '',
    score: 0
  }

  created(): void {
    this.actionSetInitialProgress()
  }

  signOut(): void {
    this.actionSignOut(this.moduleGetterUserName)
  }

  saveProgressToDB(): void {
    console.debug(this.moduleGettrProgressArr)
    this.mutationSetProgress(this.moduleGettrProgressArr)
    this.actionSaveProgress()
  }

  editLevel(lvl: IAccountLevel): void {
    this.level = lvl
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
p {
  color: white;
  font-size: 0.8rem;
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
</style>
