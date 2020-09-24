<template>
  <div class="btn-group">
    <span v-for="index in scrubber.totalFrames" :key="index" @mouseover="scrubber.seek(index - 1)">
      <button :class="{ selected: scrubber.frameIndex === index - 1 }"></button>
    </span>
  </div>
</template>
<script lang="ts">
import { ScrubberController } from '@/engine/controller'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: { scrubber: { type: Object as PropType<ScrubberController>, required: true } },
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
