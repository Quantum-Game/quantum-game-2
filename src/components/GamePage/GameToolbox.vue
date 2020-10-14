<template>
  <div class="toolbox" layout="row wrap" @mouseup="onRelease">
    <div
      v-for="[piece, count] in tools"
      :key="piece.type"
      :class="{ tool: true, inactive: count === 0 }"
      layout="column middle"
      @mouseenter="showPieceHint(piece)"
    >
      <svg
        viewBox="0 0 64 64"
        :width="tileSize"
        :height="tileSize"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle :cx="0" :cy="0" r="1" fill="#edeaf4" />
        <circle :cx="0" :cy="64" r="1" fill="#edeaf4" />
        <circle :cx="64" :cy="0" r="1" fill="#edeaf4" />
        <circle :cx="64" :cy="64" r="1" fill="#edeaf4" />
        <AppCell :piece="piece" :available="count > 0" @grab="onGrab(piece.type)" />
      </svg>
      <span class="counter">× {{ count }}</span>
    </div>
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
    tileSize: { type: Number, default: 64 },
  },
  emits: {
    hover: validateInfoPayload,
    grab: Number,
    release: null,
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
      Array.from(
        iMap(toolsVisited, (tool) => [pieceFromTool(tool, null), props.toolbox.getCount(tool)])
      )
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
.tool {
  padding: 8px 0;
  text-align: center;
  &.inactive {
    opacity: 0.4;
  }
}

.counter {
  fill: white;
  text-anchor: middle;
  font-size: 0.8rem;
}
</style>
