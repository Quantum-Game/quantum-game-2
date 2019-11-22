<template>
  <section v-if="section.title" class="entry-section">
    <h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">
      {{ section.title.toUpperCase() }}
    </h2>
    <div ref="contentWrapper" class="content-wrapper" :style="style">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="section.content" />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { EntrySectionInterface } from '@/engine/interfaces';

@Component
export default class EncyclopediaArticleSection extends Vue {
  @Prop() readonly section!: EntrySectionInterface;
  @Prop() readonly shouldBeOpenOnInit!: boolean;

  $refs!: {
    contentWrapper: HTMLElement;
  };

  isOpen: boolean = false;

  // hack, as having a computed property that's using refs
  // as an initial data property causes errors - refs are
  // not existant then.
  mounted() {
    this.isOpen = this.shouldBeOpenOnInit;
  }

  handleTitleClick(e: { target: Element }) {
    this.isOpen = !this.isOpen;
  }

  get style() {
    return {
      maxHeight: this.isOpen ? `${this.$refs.contentWrapper.scrollHeight}px` : null
    };
  }
}
</script>

<style lang="scss" scoped>
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
    @media screen and (max-width: 1000px) {
      text-align: center;
    }
    &:after {
      display: inline-block;
      position: relative;
      content: '';
      left: 12px;
      height: 0;
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
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    line-height: 1.3rem;
    letter-spacing: 1px;
    text-align: left;
    line-height: 1.5em;
  }
  @media screen and (max-width: 1000px) {
    padding-left: 20px;
  }
}
</style>
