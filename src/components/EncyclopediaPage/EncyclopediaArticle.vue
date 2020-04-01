<template>
  <div v-if="entry" class="entry">
    <article>
      <!-- TITLE -->
      <h1 class="title">{{ entry.title.toUpperCase() }}</h1>
      <h2 class="short" v-html="entry.short" />

      <!-- GRIDS -->
      <div class="grids">
        <div v-for="(iGrid, i) in entry.grids" :key="`board-${i}-${entry.elementName}`">
          <encyclopedia-board :i-grid="iGrid" :step="5" class="grid" />
        </div>
      </div>

      <!-- SECTIONS -->
      <encyclopedia-article-section
        v-for="section in entry.sections"
        :key="section.title"
        :section="section"
        :should-be-open-on-init="true"
      />

      <!-- EQUATION GRID -->
      <encyclopedia-transition
        v-if="showMatrix"
        :key="`transition-${entry.elementName}`"
        :element-name="entry.elementName"
        :rotation="entry.defaultRotation"
        step="3"
      />
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { IEntry } from '@/engine/interfaces'
import { Cell } from '@/engine/classes'
import { getEntry } from './loadData'
import AppButton from '@/components/AppButton.vue'
import EncyclopediaArticleSection from '@/components/EncyclopediaPage/EncyclopediaArticleSection.vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaTransition from '@/components/EncyclopediaPage/EncyclopediaTransition.vue'

@Component({
  components: {
    AppButton,
    EncyclopediaArticleSection,
    EncyclopediaBoard,
    EncyclopediaTransition
  }
})
export default class EncyclopediaArticle extends Vue {
  entry: IEntry = {
    title: '',
    elementName: 'Mirror',
    grids: [],
    sections: []
  }

  created(): void {
    this.loadEntry()
  }

  @Watch('$route')
  loadEntry(): void {
    if (this.entryURL) {
      this.entry = getEntry(this.entryURL)
    }
    if (!this.entry.title) {
      this.$router.push({ name: '404' })
    }
  }

  get entryURL(): string {
    return this.$route.params.entry
  }

  // FIXME: Code smell, move to element value
  get showMatrix(): boolean {
    const dontShowMatrix = ['Laser']
    let elementExists: boolean
    try {
      elementExists = !!Cell.fromName(this.entry.elementName)
    } catch (error) {
      elementExists = false
    }
    return dontShowMatrix.indexOf(this.entry.elementName) < 0 && elementExists
  }
}
</script>

<style lang="scss" scoped>
article {
  width: 95%;
}
.entry {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  & .title {
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 30px;
  }
  & .short {
    font-size: 1rem;
    padding-right: 20%;
    padding-left: 20%;
    padding-bottom: 20px;
    font-weight: 300;
    line-height: 1.5rem;
    letter-spacing: 0.5px;
  }
  & .go-back {
    font-weight: bold;
    text-decoration: none;
    color: white;
  }
  & p {
    line-height: 2em;
    text-align: left;
  }
  @media screen and (max-width: 1000px) {
    width: 100vw;
    article {
      width: 90vw;
    }
  }
}

h1 {
  padding-bottom: 1rem;
  border-bottom: 1px solid white;
  text-align: center;
}
.grids {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #8e819d;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
}
.placeholder {
  padding-top: 2rem;
  width: 100%;
  border-bottom: 1px solid #8e819d;
  & .grid {
    width: 100%;
    margin: 0 auto 0rem;
    height: 200px;
    text-align: center;
    padding-bottom: 4rem;
    & span {
      font-size: 1rem;
      color: gold;
    }
  }
}
</style>
