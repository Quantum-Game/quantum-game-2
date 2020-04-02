<template>
  <app-layout>
    <div slot="main">
      <h1>Saved Levels</h1>
      <div class="my-levels">
        <h2>My levels:</h2>
        <ul class="levels-list">
          <li v-for="(lvl, index) in moduleGetterSavedLevelsList" :key="index">
            Level: <router-link :to="lvl.link">{{ lvl.link }}</router-link>
            <a class="remove-btn" @click.prevent="removeLevel(lvl.id, lvl.public)"
              ><app-button type="special"> X </app-button></a
            >
            <a v-if="!lvl.public" class="private-btn" @click.prevent="makePublic(lvl.id)"
              ><app-button type="special"> Private </app-button></a
            >
            <a v-if="lvl.public" class="public-btn" @click.prevent="makePrivate(lvl.id)"
              ><app-button type="basic"> Public </app-button></a
            >
          </li>
        </ul>
      </div>
      <br />
      <br />
      <div class="public-levels">
        <h2>All public levels:</h2>
        <ul class="levels-list">
          <li v-for="(lvl, index) in moduleGetterPublicLevels" :key="index">
            Level: <router-link :to="lvl.link">{{ lvl.link }}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div slot="right">
      <a @click.prevent="signOut"><app-button type="special"> Sign Out! </app-button></a>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
// import $userStore from '@/store/userStore'
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'

const user = namespace('userModule')

@Component({
  components: {
    AppLayout,
    AppButton
  }
})
export default class SavedLevels extends Vue {
  @user.Action('MAKE_LEVEL_PRIVATE') actionMakeLevelPrivate!: Function
  @user.Action('MAKE_LEVEL_PUBLIC') actionMakeLevelPublic!: Function
  @user.Action('SIGN_OUT') actionSignOut!: Function
  @user.Action('REMOVE_LEVEL') actionRemoveLevel!: Function
  @user.Getter('userName') moduleGetterUserName!: string
  @user.Getter('savedLevelsList') moduleGetterSavedLevelsList!: []
  @user.Getter('publicLevels') moduleGetterPublicLevels!: []

  // get user(): string {
  //   return $userStore.getters.userName
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // get savedLevels(): any {
  //   return $userStore.getters.savedLevelsList
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // get publicLevels(): any {
  //   return $userStore.getters.publicLevels
  // }

  removeLevel(id: string, isPublic: boolean): void {
    if (isPublic) {
      this.actionMakeLevelPrivate(id)
    }
    // $userStore.dispatch('REMOVE_LEVEL', id)
    this.actionRemoveLevel(id)
  }

  makePublic(id: string): void {
    // $userStore.dispatch('MAKE_LEVEL_PUBLIC', id)
    this.actionMakeLevelPublic(id)
  }

  makePrivate(id: string): void {
    // $userStore.dispatch('MAKE_LEVEL_PRIVATE', id)
    this.actionMakeLevelPrivate(id)
  }

  signOut(): void {
    this.actionSignOut(this.moduleGetterUserName)
    // $userStore.dispatch('SIGN_OUT', this.moduleGetterUserName)
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
.levels-list {
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
.remove-btn {
  margin-right: 20px;
  margin-left: 20px;
}
</style>
