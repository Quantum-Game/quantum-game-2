<template>
  <app-layout>
    <encyclopedia-link-list slot="left" :entry-list="entryList" />
    <div slot="main">
      <router-view />
    </div>
    <div slot="right"  class="upper-border">
      <h3>RELATED CONCEPTS</h3>
    </div>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { entriesNameList } from '@/assets/data/entries';
import AppLayout from '@/components/AppLayout.vue';
import EncyclopediaArticle from '@/components/EncyclopediaPage/EncyclopediaArticle.vue';
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue';

@Component({
  components: {
    AppLayout,
    EncyclopediaArticle,
    EncyclopediaLinkList
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
  text-align: left;
  color: white;
  text-decoration: none;
}
</style>
