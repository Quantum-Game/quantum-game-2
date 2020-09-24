<template>
  <div class="toolbox" @mouseup="onRelease">
    <svg
      v-for="[piece, count] in tools"
      :key="piece.type"
      class="tool"
      viewBox="0 0 80 80"
      preserveAspectRatio="xMidYMid meet"
      @mouseenter="showPieceHint(piece)"
    >
      <g :class="count > 0 ? 'active' : 'inactive'">
        <g>
          <circle :cx="0" :cy="0" r="1" fill="#edeaf4" />
          <circle :cx="0" :cy="64" r="1" fill="#edeaf4" />
          <circle :cx="64" :cy="0" r="1" fill="#edeaf4" />
          <circle :cx="64" :cy="64" r="1" fill="#edeaf4" />
        </g>
        <app-cell :piece="piece" :available="count > 0" @grab="onGrab(piece.type)" />
        <text class="counter" x="40%" y="80">× {{ count }}</text>
      </g>
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Toolbox from '@/engine/Toolbox'
import AppCell from '@/components/Board/AppCell.vue'
import { validateInfoPayload } from '@/mixins/gameInterfaces'
import { computed, defineComponent, reactive, watchEffect } from 'vue'
import { iMap } from '@/itertools'
import { Elem, Piece, pieceFromTool } from '@/engine/model'

export default defineComponent({
  components: {
    AppCell,
  },
  props: {
    toolbox: { type: Toolbox, required: true },
  },
  emits: {
    hover: validateInfoPayload,
    grab: Number,
    release: Number,
  },
  setup(props, { emit }) {
    const toolsVisited = reactive(new Set<Elem>())

    watchEffect(() => {
      for (const [tool, count] of props.toolbox.tools) {
        if (count > 0) {
          toolsVisited.add(tool)
        }
      }
    })

    const tools = computed(() =>
      Array.from(iMap(toolsVisited, (tool) => [pieceFromTool(tool), props.toolbox.getCount(tool)]))
    )

    function showPieceHint(piece: Piece) {
      emit('hover', { kind: 'piece', piece, text: 'Drag&drop on board.' })
    }

    function onGrab(elem: Elem) {
      emit('grab', elem)
    }

    function onRelease() {
      emit('release')
    }

    return { tools, showPieceHint, onGrab, onRelease }
  },
})
</script>

<style lang="scss" scoped>
body {
  overflow-y: hidden;
}
.title {
  color: rgba($color: #fff, $alpha: 1);
  font-weight: 900;
  margin-top: 0px;
  padding-bottom: 15px;
  font-size: 0.8rem;
  text-transform: uppercase;
  width: 100%;
  text-align: center;
  border-top: solid 2px #fff;
  @include media('<large') {
    display: none;
  }
}
.toolbox {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding: 5px;
  @include media('<large') {
    justify-content: space-evenly;
    border-top: none;
    &::after {
      content: '';
      flex-grow: 99999999;
    }
  }
  .tool-rect {
    fill: #2e006a;
    opacity: 0.5;
  }
  .tool {
    width: 30%;
    min-width: 64px;
    padding: 0.5rem 0rem;
    height: 90px;
    @include media('<large') {
      width: 64px;
      padding: 0;
      width: auto;
      min-width: 35px;
      min-height: 0;
      flex-grow: 1;
      flex-basis: 20%;
      height: 15vw;
    }
    .counter {
      transform-origin: 50% 100%;
      fill: white;
      text-anchor: middle;
      margin: 0;
      font-size: 0.8rem;
    }
    .inactive {
      opacity: 0.4;
    }
    .active {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
