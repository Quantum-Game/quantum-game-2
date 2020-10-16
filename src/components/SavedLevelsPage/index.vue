<template>
  <AppLayout>
    <template #main>
      <h1>Saved Levels</h1>
      <div class="my-levels">
        <h3>My levels</h3>
        <ul class="levels-list">
          <li v-for="(lvl, index) in savedLevels" :key="index">
            <router-link :to="lvl.link">{{ lvl.id.slice(0, 8) }}</router-link>
            ({{ printDate(lvl.createdAt) }})
            <a class="remove-btn" @click.prevent="removeLevel(lvl.id, lvl.public)"
              ><AppButton type="special"> X </AppButton></a
            >
            <a v-if="!lvl.public" class="private-btn" @click.prevent="makePublic(lvl.id)"
              ><AppButton type="special"> Unlisted </AppButton></a
            >
            <a v-if="lvl.public" class="public-btn" @click.prevent="makePrivate(lvl.id)"
              ><AppButton type="basic"> Public </AppButton></a
            >
          </li>
        </ul>
      </div>
      <br />
      <br />
      <div class="public-levels">
        <h3>All public levels</h3>
        <ul class="levels-list">
          <li v-for="(lvl, index) in publicLevels" :key="index">
            <router-link :to="lvl.link">{{ lvl.id.slice(0, 8) }}</router-link>
            ({{ printDate(lvl.createdAt) }})
          </li>
        </ul>
      </div>
      <div class="signOut">
        <a @click.prevent="signOut">Sign Out</a>
      </div>
    </template>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import AppButton from '@/components/AppButton.vue'
import { Timestamp } from '@/store/storeInterfaces'
import { storeNamespace } from '@/store'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppLayout,
    AppButton,
  },
  setup() {
    const user = storeNamespace('user')
    const makePrivate = user.useAction('MAKE_LEVEL_PRIVATE')
    const removeLevel = user.useAction('REMOVE_LEVEL')

    return {
      makePrivate,
      makePublic: user.useAction('MAKE_LEVEL_PUBLIC'),
      signOut: user.useAction('SIGN_OUT'),
      savedLevels: user.useGetter('savedLevelsList'),
      publicLevels: user.useGetter('publicLevels'),

      printDate(timestamp: Timestamp): string {
        if (!timestamp) {
          return ''
        }
        const date = timestamp.toDate()
        return date.toUTCString()
      },

      removeLevel(id: string, isPublic: boolean): void {
        if (isPublic) {
          makePrivate(id)
        }
        removeLevel(id)
      },
    }
  },
})
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
