<template>
  <section v-if="section.title" class="entry-section">
    <h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">
      {{ section.title }}
    </h2>
    <div class="content-wrapper" :style="style">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="parsedContent" />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import type { IEntrySection } from '@/engine/interfaces'
import { IStyle } from '@/types'

export default class EncyclopediaArticleSection extends Vue {
  @Prop() readonly section!: IEntrySection
  @Prop() readonly shouldBeOpenOnInit!: boolean

  isOpen = false

  // hack, as having a computed property that's using refs
  // as an initial data property causes errors - refs are
  // not existant then.
  mounted(): void {
    this.isOpen = this.shouldBeOpenOnInit
  }

  handleTitleClick(): void {
    this.isOpen = !this.isOpen
  }

  get style(): IStyle {
    return {
      maxHeight: this.isOpen ? undefined : '0px',
    }
  }

  /**
   * Add fontawesome icons to links (dirty).
   */
  get parsedContent(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.section
      .content!.replace(
        /(href="[^"]+wikipedia[^"]+">[^<]+)/g,
        '$1 <i class="fab fa-wikipedia-w"></i>'
      )
      .replace(/(href="[^"]+youtube[^"]+">[^<]+)/g, '$1 <i class="fab fa-youtube"></i>')
      .replace(/(href="[^"]+arxiv[^"]+">[^<]+)/g, '$1 <i class="fas fa-book-open"></i>')
      .replace(
        /(href="[^"]+(edmundoptics|rp-photonics|thorlabs)[^"]+">[^<]+)/g,
        '$1 <i class="fas fa-microscope"></i>'
      )
  }
}
</script>

<style scoped lang="scss">
section.entry-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  & .entry-title {
    padding: 1em 0;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: 0.4s;
    margin: 0;
    font-weight: bold;
    text-align: justify;
    text-transform: uppercase;
    @include media('<large') {
      text-align: center;
      width: 90%;
    }
    &:after {
      display: inline-block;
      position: relative;
      content: '';
      left: 12px;
      // height: 0;
      border-left: 6px solid #e8e8e8;
      border-bottom: 6px solid transparent;
      border-top: 6px solid transparent;
      clear: both;
      transition: 0.2s;
    }
    &.active:after {
      transform: rotate(90deg);
      transition: 0.2s;
    }
  }
  & .content-wrapper {
    font-weight: lighter;
    font-size: 1rem;
    // max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    line-height: 1.3rem;
    letter-spacing: 0.5px;
    text-align: left;
    line-height: 1.5em;
  }
  @include media('<large') {
    padding-left: 20px;
  }
}
</style>
