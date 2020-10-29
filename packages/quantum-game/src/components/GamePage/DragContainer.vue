<template>
  <div class="drag-container">
    <svg
      v-if="dragState"
      viewBox="0 0 64 64"
      :width="tileSize"
      :height="tileSize"
      :style="dragState.style"
    >
      <AppCell :piece="dragState.piece" :interacting="true" />
    </svg>
  </div>
</template>

<script lang="ts">
import AppCell from '@/components/Board/AppCell.vue'
import { GrabController, GrabSource, GrabState } from '@/engine/controller'
import { Piece, pieceFromTool } from '@/engine/model'
import { useMouseCoords } from '@/mixins'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { AppCell },
  props: {
    grabCtl: { type: Object as PropType<GrabController>, required: true },
    tileSize: { type: Number, required: true },
  },
  setup(props) {
    const mouse = useMouseCoords()

    function grabbedPiece(state: GrabState): Piece {
      switch (state.source) {
        case GrabSource.Board:
          return state.piece
        case GrabSource.Toolbox:
          return pieceFromTool(state.type, null)
      }
    }

    const dragState = computed(() => {
      const grab = props.grabCtl.grabState
      const halfTile = props.tileSize / 2
      if (grab == null) return null
      return {
        piece: grabbedPiece(grab),
        style: {
          transformOrigin: `50% 50%`,
          transform: `translate(${mouse.pageX - halfTile}px, ${mouse.pageY - halfTile}px)`,
        },
      }
    })

    return { dragState }
  },
})
</script>

<style lang="scss" scoped>
.drag-container {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  svg {
    overflow: visible;
  }
}
</style>
