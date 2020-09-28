<template>
  <div class="btn-group">
    <span v-for="index in playhead.totalFrames" :key="index" @mouseover="playhead.seek(index - 1)">
      <button :class="{ selected: playhead.frameIndex === index - 1 }"></button>
    </span>
  </div>
</template>
<script lang="ts">
import { PlayheadController } from '@/engine/controller'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: { playhead: { type: Object as PropType<PlayheadController>, required: true } },
})
</script>
<style lang="scss" scoped>
.btn-group {
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;

  button {
    background-color: transparent;
    border-radius: 50%;
    border: 1px solid #fff;
    padding: 5px 5px;
    margin: 5px;
    cursor: pointer;
  }

  &:after {
    content: '';
    clear: both;
    display: table;
  }

  button:hover {
    background-color: white;
  }

  .selected {
    background-color: white;
  }
}
</style>
