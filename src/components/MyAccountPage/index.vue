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
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import $userStore from '@/store/userStore'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

interface AccountLevel {
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

  created() {
    $userStore.dispatch('SET_INITIAL_PROGRESS')
  }

  get user() {
    return $userStore.getters.userName
  }

  get progressArr() {
    return $userStore.getters.progressArr
  }

  signOut() {
    $userStore.dispatch('SIGN_OUT', this.user)
  }

  saveProgressToDB() {
    console.debug(this.progressArr)
    $userStore.commit('SET_PROGRESS', this.progressArr)
    $userStore.dispatch('SAVE_PROGRESS')
  }

  editLevel(lvl: AccountLevel) {
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
