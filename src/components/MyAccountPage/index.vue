<template>
  <app-layout>
    <div slot="main">
      <h1>My Account</h1>
      <h2>Hello {{ user }}</h2>
      <div>
        <label>Status: </label>
        <input v-model="level.status" type="text" />
        <label> Score: </label>
        <input v-model="level.score" type="text" />
      </div>
      <br />
      <br />
      <ul class="levels-progress">
        <li v-for="(lvl, index) in progressArr" :key="index">
          Level: {{ lvl.id }} Status: {{ lvl.status }} Score: {{ lvl.score }}
          <span class="edit-level" @click="editLevel(lvl)"> >>>> Edit</span>
        </li>
      </ul>
      <a @click.prevent="saveProgressToDB"
        ><app-button type="special"> Save data to Firestore!!! </app-button></a
      >
    </div>
    <div slot="right">
      <a @click.prevent="signOut"><app-button type="special"> Sign Out! </app-button></a>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import $userStore from '@/store/userStore'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

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
  level = {
    id: 0,
    status: '',
    score: 0
  }

  created(): void {
    $userStore.dispatch('SET_INITIAL_PROGRESS')
  }

  get user(): string {
    return $userStore.getters.userName
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get progressArr(): any {
    return $userStore.getters.progressArr
  }

  signOut(): void {
    $userStore.dispatch('SIGN_OUT', this.user)
  }

  saveProgressToDB(): void {
    console.debug(this.progressArr)
    $userStore.commit('SET_PROGRESS', this.progressArr)
    $userStore.dispatch('SAVE_PROGRESS')
  }

  editLevel(lvl: IAccountLevel): void {
    this.level = lvl
  }
}
</script>

<style lang="scss" scoped>
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
