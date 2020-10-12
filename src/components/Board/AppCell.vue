<template>
  <g
    :class="cellClass"
    :style="cellStyle"
    @mousedown.prevent="onMouseDown"
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
import {
  Coord,
  Elem,
  hasAnyFlag,
  hasFlags,
  Piece,
  PieceFlags,
  rotationToDegrees,
} from '@/engine/model'
import { IStyle } from '@/types'
import { Easing, useAngleTween, useTween } from '@/mixins'

const tileSize = 64

export default defineComponent({
  props: {
    piece: { type: Object as PropType<Piece>, required: true },
    coord: { type: Object as PropType<Coord>, required: false },
    interacting: { type: Boolean, default: false },
    energized: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  emits: ['grab', 'touch'],
  setup(props, { emit }) {
    const hover = ref(false)

    const releaseDiff = (() => {
      const releasePoint = props.piece.releasePoint
      if (releasePoint == null) return { x: 0, y: 0 }
      const coord = props.coord ?? Coord.new(0, 0)
      const dx = coord.x - releasePoint.x + 0.5
      const dy = coord.y - releasePoint.y + 0.5
      return { x: dx * 64, y: dy * 64 }
    })()

    const releaseOffset = useTween({
      from: () => releaseDiff,
      to: () => ({ x: 0, y: 0 }),
      easing: Easing.Exponential.Out,
      duration: 100,
    })

    const tweenRotation = useAngleTween({
      to: () => rotationToDegrees(props.piece.rotation),
      easing: Easing.Exponential.Out,
      duration: 200,
    })

    // const tweenRotation = computed(() => rotationToDegrees(props.piece.rotation))

    const pieceState = computed(
      (): PieceState => {
        return {
          hover: hover.value,
          interacting: props.interacting,
          energized: props.energized > 0,
        }
      }
    )

    const rectStyle = computed(() => {
      const rotation = tweenRotation.value
      const halfTile = tileSize / 2
      const { x, y } = releaseOffset.value
      return {
        transformOrigin: `${halfTile}px ${halfTile}px`,
        transform: `rotate(${rotation}deg)  translate(${x}px, ${y}px)`,
      }
    })

    const cellStyle = computed(
      (): IStyle => {
        const rotation = tweenRotation.value
        const coord = props.coord ?? Coord.new(0, 0)
        const origin = coord.gridCenter()
        const translate = coord.gridTopLeft()
        const { x, y } = releaseOffset.value

        return {
          transformOrigin: `${origin.x - x}px ${origin.y - y}px`,
          transform: `rotate(${-rotation}deg) translate(${translate.x - x}px, ${translate.y -
            y}px)`,
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
        active: hasAnyFlag(props.piece.flags, PieceFlags.Draggable | PieceFlags.Rotateable),
        frozen: !props.available || !hasFlags(props.piece.flags, PieceFlags.Draggable),
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
        'movable-space':
          !props.interacting &&
          hasAnyFlag(props.piece.flags, PieceFlags.Draggable | PieceFlags.Rotateable),
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
    function onMouseDown(e: MouseEvent) {
      if (e.buttons === 1) {
        clickState = ClickState.JustClicked
      }
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
