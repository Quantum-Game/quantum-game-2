<template>
  <button :disabled="disabled" :class="computeClass">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    type: { type: String, default: 'basic' },
    inline: { type: Boolean, default: true },
    overlay: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    computeClass(): string[] {
      return [this.type, this.inline ? 'inline' : '', this.overlay ? 'overlay-btn' : '']
    },
  },
})
</script>

<style scoped lang="scss">
button {
  display: inline-block;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  color: white;
  padding: 8px 20px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  font-size: 1rem;
  transition: 0.5s;
  align-items: center;
  &.inline {
    display: inline;
  }

  &.basic {
    background-color: #5b00d1;
    border-bottom: 4px solid #120223;
    &:hover {
      background-color: #4700a3;
      transition: 0.5s;
      text-decoration: none;
    }
  }

  &.special {
    background-color: #ff0055;
    border-bottom: 4px solid #890236;
    &:not(:disabled):hover {
      background-color: #c20047;
      transition: 0.5s;
      text-decoration: none;
    }
  }

  &.big {
    background-color: #5c00d3;
    font-size: 1.5rem;
    border-bottom: 4px solid #120223;
    &:not(:disabled):hover {
      background-color: #4700a3;
      transition: 0.5s;
      text-decoration: none;
    }
  }

  &:disabled {
    cursor: initial;
    outline: none;
    color: #beabd8;
    background-color: #6c508c;
    border-bottom-color: #3e2954;
  }

  &.overlay-btn {
    margin: 5px;
    text-decoration: none;
  }
}
</style>
