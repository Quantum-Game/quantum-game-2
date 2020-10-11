<template>
  <div layout="column">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <h2 class="short" v-html="entry.short" />
    <!-- GRIDS -->
    <div class="grids">
      <div layout="row wrap around u5">
        <encyclopedia-board
          v-for="(iGrid, i) in entry.grids"
          :key="i"
          :grid="iGrid"
          :step="5"
          :default-step="2"
        />
      </div>
    </div>

    <!-- SECTIONS -->
    <encyclopedia-article-section
      v-for="section in entry.sections"
      :key="section.title"
      :section="section"
    />

    <!-- EQUATION GRID -->
    <encyclopedia-transition
      v-if="showMatrix"
      :key="`transition-${entry.elementName}`"
      :element-name="entry.elementName"
      :default-rotation="entry.defaultRotation"
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
.short {
  font-size: 1rem;
  padding-right: 20%;
  padding-left: 20%;
  padding-bottom: 20px;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: 0.5px;
  text-align: center;
}

.grids {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
