<template>
  <div class="btn-group" layout="column center">
    <div ref="buttons" @pointerdown="onPointer" @pointermove="onPointer">
      <span v-for="index in playhead.totalFrames" :key="index">
        <button :class="{ selected: playhead.frameIndex === index - 1 }"></button>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { PlayheadController } from '@/engine/controller'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: { playhead: { type: Object as PropType<PlayheadController>, required: true } },
  setup(props) {
    const buttons = ref<HTMLElement>()

    return {
      buttons,
      onPointer(e: PointerEvent) {
        const box = buttons.value?.getBoundingClientRect()
        if (box == null) return

        const localX = (e.clientX - box.x) / box.width
        const index = localX * props.playhead.totalFrames
        props.playhead.seek(Math.floor(index))
      },
    }
  },
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

  .selected {
    background-color: white;
  }
}
</style>
