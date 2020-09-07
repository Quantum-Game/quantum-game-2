<template>
  <app-layout>
    <template v-slot:left>
      <encyclopedia-link-list :entry-list="elementList" title="Elements" />
    </template>
    <template v-slot:main>
      <router-view />
    </template>
    <template v-slot:right>
      <encyclopedia-link-list :entry-list="conceptList" title="Concepts" />
    </template>
  </app-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { elementNameList, conceptNameList } from './loadData'
import AppLayout from '@/components/AppLayout.vue'
import EncyclopediaArticle from '@/components/EncyclopediaPage/EncyclopediaArticle.vue'
import EncyclopediaLinkList from '@/components/EncyclopediaPage/EncyclopediaLinkList.vue'

// FIXME: Code smell move to interfaces
interface IEntryList {
  name: string
  ready: boolean
}

@Options({
  components: {
    AppLayout,
    EncyclopediaArticle,
    EncyclopediaLinkList,
  },
})
export default class Info extends Vue {
  elementList: IEntryList[] = []
  conceptList: IEntryList[] = []
  sections: IEntryList[] = []

  created(): void {
    this.elementList = elementNameList.map((entryName: string) => ({
      name: entryName,
      ready: true,
    }))
    this.conceptList = conceptNameList.map((entryName: string) => ({
      name: entryName,
      ready: true,
    }))
  }
}
</script>
