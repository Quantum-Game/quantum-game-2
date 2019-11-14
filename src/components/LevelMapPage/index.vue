<template>
  <app-layout>
    <article slot="main" class="main">
      <div class="container">
        <ul v-for="(group, i) in groups" :key="'group' + i" class="main__level-list">
          <ul v-for="(level, j) in group" :key="'level' + j">
            <li>
              <router-link class="levelLink" :to="`/level/${i + 1}`">Level {{ i + 1 }}</router-link>
            </li>
          </ul>
        </ul>
      </div>
    </article>
  </app-layout>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component } from 'vue-property-decorator';
import { LevelInterface } from '@/engine/interfaces';
import AppLayout from '@/components/AppLayout.vue';
import levels from '@/assets/data/levels/index';

@Component({
  components: {
    AppLayout
  }
})
export default class LevelMapPage extends Vue {
  get groups() {
    return _.groupBy(levels, (level: LevelInterface) => {
      return level.group;
    });
  }
}
</script>

<style lang="scss">
.container {
  column-count: 3;
  padding: 5em;
  @media screen and (max-width: 800px) {
    column-count: 1;
    padding: 0;
  }
}
.main {
  & .main__level-list {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0;
    margin: 10;
    list-style: none;
    & a {
      text-decoration: none;
      font-weight: bold;
      color: white;
    }
  }
}
</style>
