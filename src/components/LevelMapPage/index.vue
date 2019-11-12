<template>
  <app-layout>
    <article slot="main" class="main">
      <div class="container">
        <ul class="main__level-list">
          <li v-for="(stuff, i) in Array(34)" :key="i">
            <router-link class="levelLink" :to="`/level/${i + 1}`">Level {{ i + 1 }}</router-link>
          </li>
        </ul>
      </div>
    </article>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AppLayout from '@/components/AppLayout.vue';

@Component({
  components: {
    AppLayout
  }
})
export default class LevelMapPage extends Vue {}
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
