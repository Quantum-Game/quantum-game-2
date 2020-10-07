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
import { Vue, Options, setup } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { IEntry } from '@/engine/interfaces'
import { conceptNameList, elementNameList, getEntry } from './loadData'
import AppButton from '@/components/AppButton.vue'
import EncyclopediaArticleSection from '@/components/EncyclopediaPage/EncyclopediaArticleSection.vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaTransition from '@/components/EncyclopediaPage/EncyclopediaTransition.vue'
import { useRoute, useRouter } from 'vue-router'
import { importElem } from '@/engine/model'

@Options({
  components: {
    AppButton,
    EncyclopediaArticleSection,
    EncyclopediaBoard,
    EncyclopediaTransition,
  },
})
export default class EncyclopediaArticle extends Vue {
  entry: IEntry = {
    title: '',
    short: '',
    elementName: 'Mirror',
    grids: [],
    sections: [],
  }

  elementNameList = elementNameList
  conceptNameList = conceptNameList
  route = setup(useRoute)
  router = setup(useRouter)

  created(): void {
    this.loadEntry()
  }

  @Watch('$route')
  loadEntry(): void {
    if (this.entryURL) {
      this.entry = getEntry(this.entryURL)
      // dirty, for current 'active' parameter
      this.entry.grids.forEach((grid) =>
        grid.cells.forEach((cell) => {
          cell.active = cell.element === 'Laser'
        })
      )
    }
    if (!this.entry.title) {
      this.router.push({ name: '404' })
    }
  }

  get entryURL(): string {
    return this.route.params.entry as string
  }

  get showMatrix(): boolean {
    const dontShowMatrix = ['Laser']
    return (
      dontShowMatrix.indexOf(this.entry.elementName) < 0 &&
      importElem(this.entry.elementName) != null
    )
  }
}
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
