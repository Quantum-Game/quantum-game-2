<template>
  <transition name="hint">
    <div
      v-if="shown"
      class="hint"
      :class="hintClass"
      :style="absolutePositionStyle"
      @click="shouldHide"
    >
      <div class="close">x</div>
      <span>{{ hint.content }}</span>
    </div>
  </transition>
</template>

<script lang="ts">
import { Coord, Hint } from '@/engine/model'
import { computed, defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'SpeechBubble',
  props: {
    coord: { type: Object as PropType<Coord>, required: true },
    hint: { type: Object as PropType<Hint>, required: true },
    tileSize: { type: Number, default: 64 },
    overlay: { type: String },
  },
  setup(props) {
    const shown = ref(true)

    const hintClass = computed(() => {
      return `hint--${props.hint.color} ${props.overlay === 'second' ? 'second' : ''}`
    })

    /**
     * Top and left offsets calculation for when the tooltip
     * complements the overlay image. The outcome depends on
     * the overlay type and whether the tooltip is the "second"
     * one in the dual-tooltip overlay.
     * @returns an offsets object
     */
    function overlayPositionStyle() {
      switch (props.overlay) {
        // single rock
        case 'rock':
          return {
            top: `30%`,
            left: `50%`,
          }
        // the pile's first talking rock
        case 'pile':
        case 'pile2':
          return {
            top: `0%`,
            left: `30%`,
          }
        // second of the two talking rocks
        case 'second':
          return {
            top: `30%`,
            left: `80%`,
          }
        default:
          return {
            top: `1%`,
            left: `44%`,
          }
      }
    }

    /**
     * Top and left offsets calulations for then the tooltip appears on the board
     * @returns an offsets object
     */
    function boardPositionStyle() {
      const offset = props.coord.gridCenter(props.tileSize)

      return {
        left: offset.x + 'px',
        top: offset.y + 'px',
      }
    }

    /**
     * Positioning calculations depend on whether the tooltip
     * appears against the board (this.hint.coord determine its position)
     * or against an overlay image (then the position is "fixed" - relative to
     * image/wrapper proportions)
     * @returns an object with with the 'top' and 'left' fields -
     * the vertical and horizonatal offsets
     */
    const absolutePositionStyle = computed(() => {
      return props.overlay != null ? overlayPositionStyle() : boardPositionStyle()
    })

    /**
     * Whether clicking onto the tooltip causes it to dissapear
     * depends on the context; disabled for overlays
     */
    function shouldHide(): void {
      if (!props.overlay) {
        shown.value = false
      }
    }

    return {
      shown,
      hintClass,
      absolutePositionStyle,
      shouldHide,
    }
  },
})
</script>

<style lang="scss" scoped>
.hint {
  padding: 2px 6px 6px 6px;
  transform: translate(-50%, -100%);
  z-index: 2;
  max-width: 500px;
  position: absolute;
  color: #fff;
  font-size: 8px;
  @include media('>=small') {
    font-size: 12px;
    padding: 8px;
  }
  @include media('>=medium') {
    font-size: 16px;
    padding: 4px 12px 12px 12px;
  }
  & .close {
    text-align: right;
    font-size: 10px;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.5);
  }
  &::after {
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
  }
  &.second {
    max-width: 10vw;
  }
  &.hint--fuchsia {
    background-color: $fuchsia;
    &::after {
      border-color: $fuchsia transparent transparent transparent;
    }
  }

  &.hint--purple {
    background-color: $purple;
    &::after {
      border-color: $purple transparent transparent transparent;
    }
  }

  &.hint--orange {
    background-color: $orange;
    &::after {
      border-color: $orange transparent transparent transparent;
    }
  }
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.3s;
}
.hint-enter,
.hint-leave-to {
  opacity: 0;
}
</style>
