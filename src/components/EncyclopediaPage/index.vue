<template>
  <app-layout>
    <encyclopedia-link-list slot="left" :entry-list="entryList" />
    <div slot="main">
      <router-view />
    </div>
    <encyclopedia-link-list slot="right" :entry-list="keyConceptsList" />
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { entriesNameList, relatedConceptsNameList } from '@/assets/data/entries'
import AppLayout from '@/components/AppLayout.vue'
import EncyclopediaArticle from '@/components/EncyclopediaPage/EncyclopediaArticle.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'

// FIXME: Code smell move to interfaces
interface IEntryList {
  name: string
  ready: boolean
}

@Component({
  components: {
    AppLayout,
    EncyclopediaArticle,
    EncyclopediaLinkList
  }
})
export default class Info extends Vue {
  entryList: IEntryList[] = []
  keyConceptsList: IEntryList[] = []
  readyEntries: string[] = [
    'beam-splitter',
    'detector-four',
    'detector',
    'faraday-rotator',
    'mirror',
    'sugar-solution'
  ]

  created(): void {
    entriesNameList.forEach((entryName: string) => {
      const isReady: boolean = this.readyEntries.indexOf(entryName) > -1
      this.entryList.push({ name: entryName, ready: isReady })
    })
    relatedConceptsNameList.forEach((entryName: string) => {
      this.keyConceptsList.push({ name: entryName, ready: true })
    })
  }
}
</script>

<style lang="scss" scoped>
.upper-border {
  border-top: 1px solid white;
  text-align: left;
  color: white;
  text-decoration: none;
  margin-top: 40px;
}
</style>
