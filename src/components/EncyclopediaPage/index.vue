<template>
  <app-layout>
    <encyclopedia-link-list slot="left" :entry-list="entryList" />
    <div slot="main">
      <router-view />
    </div>
    <div slot="right" class="upper-border">
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
  entryList: Array<any> = [];
  readyEntries: string[] = [
    'beam-splitter',
    'detector-four',
    'detector',
    'faraday-rotator',
    'mirror',
    'sugar-solution'
  ];

  created() {
    entriesNameList.forEach((entryName: string) => {
      const isReady = this.readyEntries.indexOf(entryName) > -1;
      this.entryList.push({name: entryName, ready: isReady});
    });
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
