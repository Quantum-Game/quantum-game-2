<template>
  <g
    :class="cellClass"
    :style="cellStyle"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseout="hover = false"
  >
    <!-- BOUNDING RECTANGLE -->
    <rect :width="tileSize" :height="tileSize" :class="rectClass" :style="rectStyle" />

    <!-- ELEMENT SVG -->
    <component :is="cellComponent" v-if="cellComponent != null" :state="pieceState" />
  </g>
</template>

<script lang="ts">
import { elementComponents } from './Cell/index'
import { computed, defineComponent, PropType, ref } from 'vue'
import { PieceState } from './Cell/Piece'
import { Coord, Elem, Piece, rotationToDegrees } from '@/engine/model'
import { IStyle } from '@/types'

const tileSize = 64

export default defineComponent({
  props: {
    piece: { type: Object as PropType<Piece>, required: true },
    coord: { type: Object as PropType<Coord>, required: false },
    interacting: { type: Boolean, default: false },
    energized: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
  },
  emits: ['grab', 'touch'],
  setup(props, { emit }) {
    const hover = ref(false)

    const pieceState = computed(
      (): PieceState => {
        return {
          hover: hover.value,
          interacting: props.interacting,
          energized: props.energized,
        }
      }
    )

    const rectStyle = computed(() => {
      const rotation = rotationToDegrees(props.piece.rotation)
      const halfTile = tileSize / 2
      return {
        transformOrigin: `${halfTile}px ${halfTile}px`,
        transform: `rotate(${-rotation}deg)`,
      }
    })

    const cellStyle = computed(
      (): IStyle => {
        const rotation = rotationToDegrees(props.piece.rotation)
        const coord = props.coord ?? Coord.new(0, 0)
        const origin = coord.gridCenter()
        const translate = coord.gridTopLeft()

        return {
          transformOrigin: `${origin.x}px ${origin.y}px`,
          transform: `rotate(-${rotation}deg) translate(${translate.x}px, ${translate.y}px)`,
        }
      }
    )

    /**
     * Computed class
     * A fcking monstrosity
     */
    const cellClass = computed(() => {
      return {
        interacting: props.interacting,
        active: props.piece.draggable || props.piece.rotateable,
        frozen: !props.available || !props.piece.draggable,
        transparent: !props.available,
        laser: props.piece.type === Elem.Laser,
      }
    })

    /**
     * highlight tile during a move
     * @returns highlight class
     */
    const rectClass = computed(() => {
      return {
        'inner-rect': true,
        'movable-space': !props.interacting && (props.piece.draggable || props.piece.rotateable),
      }
    })

    const cellComponent = computed(() => {
      return elementComponents[props.piece.type]
    })

    const enum ClickState {
      Released,
      JustClicked,
      HandledTouch,
      HandledGrab,
    }

    let clickState = ClickState.Released
    function onMouseDown() {
      clickState = ClickState.JustClicked
    }

    function onMouseUp() {
      if (clickState === ClickState.JustClicked) {
        clickState = ClickState.HandledTouch
        emit('touch')
      }
    }

    function onMouseMove() {
      hover.value = true
      if (clickState === ClickState.JustClicked) {
        clickState = ClickState.HandledGrab
        emit('grab')
      }
    }

    return {
      hover,
      pieceState,
      tileSize,
      cellComponent,
      cellClass,
      rectClass,
      cellStyle,
      rectStyle,
      onMouseDown,
      onMouseMove,
      onMouseUp,
    }
  },
})
</script>

<style lang="scss" scoped>
rect {
  fill: transparent;
}

.inner-rect {
  fill: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.movable-space {
  transition: opacity 0.3s;
  opacity: 0.1;
}
.frozen {
  cursor: not-allowed;
  &.laser {
    cursor: pointer;
  }
}

.interacting {
  cursor: grabbing;
}

.active {
  cursor: grab;
  .transparent {
    opacity: 0.5;
  }
}
</style>
