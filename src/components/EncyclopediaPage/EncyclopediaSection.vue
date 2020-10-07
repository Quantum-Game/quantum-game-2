<template>
  <section class="entry-section" layout="column">
    <h2 :class="{ 'entry-title': true, active: isOpen }" @click="handleTitleClick">
      <slot name="title" />
    </h2>
    <slot v-if="isOpen" name="content" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    initiallyOpen: { type: Boolean, default: true },
  },
  setup(props) {
    const isOpen = ref(props.initiallyOpen)
    return {
      isOpen,
      handleTitleClick() {
        isOpen.value = !isOpen.value
      },
    }
  },
})
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
  @include media('<large') {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
