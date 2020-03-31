<template>
  <app-layout>
    <encyclopedia-link-list slot="left" :entry-list="elementList" title="Elements" />
    <encyclopedia-link-list slot="left" :entry-list="conceptList" title="Concepts" />
    <div slot="main">
      <router-view />
    </div>
    <encyclopedia-link-list slot="right" :entry-list="sections" title="Intro" />
  </app-layout>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getEntry, elementNameList, conceptNameList } from './loadData'
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
  elementList: IEntryList[] = []
  conceptList: IEntryList[] = []
  sections: IEntryList[] = []

  created(): void {
    this.elementList = elementNameList.map((entryName: string) => ({
      name: entryName,
      ready: true
    }))
    this.conceptList = conceptNameList.map((entryName: string) => ({
      name: entryName,
      ready: true
    }))
  }

  @Watch('$route')
  loadEntry(): void {
    if (this.entryURL) {
      this.sections = getEntry(this.entryURL).sections.map((section) => ({
        name: section.title,
        ready: true
      }))
    }
  }

  get entryURL(): string {
    return this.$route.params.entry
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
  @media screen and (max-width: 1000px) {
    display: none;
  }
}
</style>
