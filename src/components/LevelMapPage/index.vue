<template>
  <app-layout>
    <article slot="main" class="main">
      <div class="container">
        <div v-for="(group, i) in groups" :key="'group' + i" class="groups">
          <!-- <h3>{{ group[0].group }}</h3> -->
          <ul v-for="(level, j) in group" :key="'level' + j" class="group">
            <router-link class="levelLink" :to="`/level/${level.id}`">
              {{ level.id }} - {{ level.name }}
            </router-link>
          </ul>
        </div>
      </div>
    </article>
  </app-layout>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component } from 'vue-property-decorator'
import { ILevel } from '@/engine/interfaces'
import AppLayout from '@/components/AppLayout.vue'
import levels from '@/assets/data/levels/index'

@Component({
  components: {
    AppLayout
  }
})
export default class LevelMapPage extends Vue {
  get groups(): {} {
    return _.groupBy(levels, (level: ILevel) => {
      return level.group
    })
  }
}
</script>

<style lang="scss">
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
    margin-top: 20px;
    border-bottom: 1px solid white;
    flex-direction: column;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    & a {
      font-size: 1.2rem;
      text-decoration: none;
      text-transform: uppercase;
      font-weight: 300;
      color: white;
    }
  }
  .group {
    font-weight: 900;
  }
}
</style>
