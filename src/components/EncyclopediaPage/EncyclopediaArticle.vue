<template>
  <div layout="column u4">
    <!-- TITLE -->
    <h1 class="title">{{ entry.title }}</h1>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <h2 class="short" v-html="entry.short" />
    <!-- GRIDS -->
    <div class="grids">
      <div layout="row wrap start u5">
        <EncyclopediaBoard
          v-for="(iGrid, i) in entry.grids"
          :key="i"
          :grid="iGrid"
          :step="5"
          :defaultStep="2"
        />
      </div>
    </div>

    <!-- SECTIONS -->
    <EncyclopediaArticleSection
      v-for="section in entry.sections"
      :key="section.title"
      :section="section"
    />

    <!-- EQUATION GRID -->
    <EncyclopediaTransition
      v-if="showMatrix"
      :key="`transition-${entry.elementName}`"
      :elementName="entry.elementName"
      :defaultRotation="entry.defaultRotation"
      step="3"
    />
  </div>
</template>

<script lang="ts">
import { conceptNameList, elementNameList, getEntry } from './loadData'
import EncyclopediaArticleSection from '@/components/EncyclopediaPage/EncyclopediaArticleSection.vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaTransition from '@/components/EncyclopediaPage/EncyclopediaTransition.vue'
import { useRoute, useRouter } from 'vue-router'
import { Elem, importElem } from '@/engine/model'
import { computed, defineComponent, watchEffect } from 'vue'

export default defineComponent({
  components: {
    EncyclopediaArticleSection,
    EncyclopediaBoard,
    EncyclopediaTransition,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const entryURL = computed(() => {
      return route.params.entry as string
    })

    const entry = computed(() => {
      if (entryURL.value) {
        const entry = getEntry(entryURL.value)
        return entry
      }
      return null
    })

    watchEffect(() => {
      if (!entry.value?.title) {
        router.push({ name: '404' })
      }
    })

    const showMatrix = computed(() => {
      const elem = importElem(entry.value?.elementName)
      const dontShowMatrix = [Elem.Laser]
      return elem != null && dontShowMatrix.indexOf(elem) < 0
    })

    return {
      elementNameList,
      conceptNameList,
      entry,
      showMatrix,
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  text-transform: uppercase;
  font-size: 2em;
}

.short {
  font-size: 1rem;
  padding-bottom: 20px;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: 0.5px;
}
</style>
