<template>
  <section v-if="section.title" class="entry-section">
    <h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">
      {{ section.title }}
    </h2>
    <div ref="contentWrapper" class="content-wrapper" :style="style">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="parsedContent" />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { IEntrySection } from '@/engine/interfaces'

@Component
export default class EncyclopediaArticleSection extends Vue {
  @Prop() readonly section!: IEntrySection
  @Prop() readonly shouldBeOpenOnInit!: boolean

  $refs!: {
    contentWrapper: HTMLElement
  }

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

  get style(): {} {
    return {
      maxHeight: this.isOpen ? null : '0px' //  '`${this.$refs.contentWrapper.scrollHeight}px` : null
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

<style lang="scss">
// not scoped so that font-awesome can work with v-html
$fa-font-path: '../../../node_modules/@fortawesome/fontawesome-free/webfonts';
@import 'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss';
@import 'node_modules/@fortawesome/fontawesome-free/scss/brands.scss';
@import 'node_modules/@fortawesome/fontawesome-free/scss/solid.scss';

section.entry-section {
  border-bottom: 1px solid #8e819d;
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
    @media screen and (max-width: 1000px) {
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
  @media screen and (max-width: 1000px) {
    padding-left: 20px;
  }
}
</style>
