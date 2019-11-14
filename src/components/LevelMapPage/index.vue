<template>
  <app-layout>
    <article slot="main" class="main">
      <div class="container">
        <div v-for="(group, i) in groups" :key="'group' + i" class="groups">
          <h3>{{ group[0].group }}</h3>
          <ul v-for="(level, j) in group" :key="'level' + j" class="group">
            <li>
              <router-link class="levelLink" :to="`/level/${level.id}`">{{
                level.name
              }}</router-link>
            </li>
          </ul>
        </div>
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
  column-count: 1;
  padding: 5em;
  @media screen and (max-width: 800px) {
    column-count: 1;
    padding: 0;
  }
}
.main {
  text-align: left;
  .groups {
    display: block;
    padding: 20px;
    margin-top: 20px;
    border: 3px dotted white;
    flex-direction: column;
    & a {
      text-decoration: underline;
      font-weight: bold;
      color: white;
    }
  }
  // & .main__level-list {
  //   height: 100vh;
  //   display: flex;
  //   justify-content: space-around;
  //   padding: 0;
  //   margin: 10;
  //   list-style: none;
}
</style>
