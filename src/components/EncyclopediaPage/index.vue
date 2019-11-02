<template>
  <app-layout>
    <div slot="left" class="element-list">
      <h3 class="upper-border">ALL ELEMENTS</h3>
      <router-link v-for="entry in entryList" :key="entry" :to="`/info/${entry}`">
        <div>{{ entry }}</div>
      </router-link>
    </div>
    <div slot="main">
      <router-view />
    </div>
    <div slot="right">
      <h3 class="upper-border">RELATED CONCEPTS</h3>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { entriesNameList } from '@/assets/data/entries';
import AppLayout from '@/components/AppLayout.vue';
import EncyclopediaArticle from '@/components/EncyclopediaPage/EncyclopediaArticle.vue';

@Component({
  components: {
    AppLayout,
    EncyclopediaArticle
  }
})
export default class Info extends Vue {
  entryList: Array<string> = [];
  created() {
    entriesNameList.forEach((entryName: string) => this.entryList.push(entryName));
  }
}
</script>

<style lang="scss" scoped>
.upper-border {
  border-top: 1px solid white;
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-align: left;
  color: white;
  text-decoration: none;
}

.element-list {
  a {
    color: white;
    text-decoration: none;
    line-height: 200%;
  }
}
</style>
