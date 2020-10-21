<template>
  <AppLayout>
    <template #main>
      <article class="main">
        <div class="container">
          <div class="groups">
            <router-link class="levelLink" :to="`/lab`">VIRTUAL LAB</router-link>
          </div>
          <div v-for="(group, i) in groups" :key="'group' + i" class="groups">
            <router-link
              v-for="(level, j) in group"
              :key="'level' + j"
              class="levelLink"
              :to="`/level/${level.id}`"
            >
              {{ level.id }} - {{ level.name }}
            </router-link>
          </div>
        </div>
      </article>
    </template>
  </AppLayout>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import AppLayout from '@/components/AppLayout.vue'
import { levels } from '@/assets/data/levels/index'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    AppLayout,
  },
  setup() {
    return {
      groups: groupBy(levels, (level) => level.group),
    }
  },
})
</script>

<style lang="scss" scoped>
.main {
  .container {
    column-count: 1;
    padding: 5em;
    @media screen and (max-width: 800px) {
      column-count: 1;
      padding: 0;
    }
  }
  text-align: center;
  .groups {
    display: block;
    padding: 20px;
    border-bottom: 1px solid white;
    flex-direction: column;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    @media screen and (max-width: 800px) {
      margin: 20px 30px 0px 30px;
    }
  }
  .levelLink {
    display: block;
    font-weight: 900;
    margin: 5px;
  }
}
</style>
