<template>
  <app-layout>
    <div slot="main">
      <h1>Saved Levels</h1>
      <div class="my-levels">
        <h3>My levels</h3>
        <ul class="levels-list">
          <li v-for="(lvl, index) in moduleGetterSavedLevelsList" :key="index">
            <router-link :to="lvl.link">{{ lvl.id.slice(0, 8) }}</router-link>
            ({{ printDate(lvl.createdAt) }})
            <a class="remove-btn" @click.prevent="removeLevel(lvl.id, lvl.public)"
              ><app-button type="special"> X </app-button></a
            >
            <a v-if="!lvl.public" class="private-btn" @click.prevent="makePublic(lvl.id)"
              ><app-button type="special"> Unlisted </app-button></a
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
        <h3>All public levels</h3>
        <ul class="levels-list">
          <li v-for="(lvl, index) in moduleGetterPublicLevels" :key="index">
            <router-link :to="lvl.link">{{ lvl.id.slice(0, 8) }}</router-link>
            ({{ printDate(lvl.createdAt) }})
          </li>
        </ul>
      </div>
      <div class="signOut">
        <a @click.prevent="signOut">Sign Out</a>
      </div>
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
    AppButton,
  },
})
export default class SavedLevels extends Vue {
  @user.Action('MAKE_LEVEL_PRIVATE') actionMakeLevelPrivate!: Function
  @user.Action('MAKE_LEVEL_PUBLIC') actionMakeLevelPublic!: Function
  @user.Action('SIGN_OUT') actionSignOut!: Function
  @user.Action('REMOVE_LEVEL') actionRemoveLevel!: Function
  @user.Getter('userName') moduleGetterUserName!: string
  @user.Getter('savedLevelsList') moduleGetterSavedLevelsList!: []
  @user.Getter('publicLevels') moduleGetterPublicLevels!: []

  removeLevel(id: string, isPublic: boolean): void {
    if (isPublic) {
      this.actionMakeLevelPrivate(id)
    }
    this.actionRemoveLevel(id)
  }

  makePublic(id: string): void {
    this.actionMakeLevelPublic(id)
  }

  makePrivate(id: string): void {
    this.actionMakeLevelPrivate(id)
  }

  signOut(): void {
    this.actionSignOut(this.moduleGetterUserName)
  }

  printDate(timestamp: any): string {
    if (!timestamp) {
      return ''
    }
    const date = timestamp.toDate()
    return date.toUTCString()
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
.levels-list {
  list-style: none;
  li {
    margin: 5px auto;
  }
}
.remove-btn {
  margin-right: 20px;
  margin-left: 20px;
}
.signOut {
  margin: 20px 10px 10px 10px;
}
</style>
