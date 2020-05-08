<template>
  <transition name="hint">
    <div
      v-if="shown"
      ref="tooltip"
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
import { Mixins, Component, Prop, Watch } from 'vue-property-decorator'
import Hint from '@/engine/Hint'
import Position from '@/mixins/Position'
interface IAbsolutePosition {
  left: string
  top: string
}

@Component
export default class SpeechBubble extends Mixins(Position) {
  @Prop({
    default: () => {
      return {
        color: 'purple',
      }
    },
  })
  readonly hint!: Hint

  @Prop({ default: 64 }) readonly tileSize!: number
  // default value added so the tooltip
  // may be displayed even though there
  // there is a wrapper issue (say, the graphic)
  // TO DO! do the type
  @Prop({
    default: () => {
      return {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
      }
    },
  })
  readonly wrapperRect!: {
    width: number
    height: number
    y: number
    x: number
    top: number
    bottom: number
    left: number
    right: number
  }

  @Prop({ default: null }) readonly overlay!: string | null

  positionX!: number
  positionY!: number

  contentRect = {
    width: 0,
    height: 0,
  }

  shown = true

  $refs!: {
    tooltip: HTMLDivElement
  }

  /**
   * The life-cycle method is used by the component
   * to assess its own bounding client rect
   */
  mounted(): void {
    this.assessOwnRect()
  }

  /**
   * The component holds it own dimensions (and the initial position)
   * in its state for proper positioning against the wrapper;
   * updated when appropriate using watchers.
   */
  @Watch('wrapperRect')
  @Watch('hint', { deep: true })
  @Watch('overlay')
  assessOwnRect(): void {
    this.contentRect = this.$refs.tooltip.getBoundingClientRect()
  }

  /**
   * Whether clicking onto the tooltip causes it to dissapear
   * depends on the context; disabled for overlays
   */
  shouldHide(): void {
    if (!this.overlay) {
      this.shown = false
    }
  }

  /**
   * Used for coloring
   * @returns a color class name
   */
  get hintClass(): string {
    return `hint--${this.hint.color} ${this.overlay === 'second' ? 'second' : ''}`
  }

  /**
   * Positioning calculations depend on whether the tooltip
   * appears against the board (this.hint.coord determine its position)
   * or against an overlay image (then the position is "fixed" - relative to
   * image/wrapper proportions)
   * @returns an object with with the 'top' and 'left' fields -
   * the vertical and horizonatal offsets
   */
  get absolutePositionStyle(): IAbsolutePosition {
    return this.overlay ? this.overlayPositionStyle : this.boardPositionStyle
  }

  /**
   * Top and left offsets calulations for then the tooltip appears on the board
   * @returns an offsets object
   */
  get boardPositionStyle(): IAbsolutePosition {
    const topOffset =
      this.wrapperRect.top +
      this.hint.coord.y * (this.tileSize - 1) +
      this.tileSize / 2 -
      this.contentRect.height

    const leftOffset =
      this.wrapperRect.left +
      this.hint.coord.x * (this.tileSize - 1) +
      this.tileSize / 2 -
      this.contentRect.width / 2

    return {
      left: leftOffset + 'px',
      top: topOffset + 'px',
    }
  }

  /**
   * Top and left offsets calculation for when the tooltip
   * complements the overlay image. The outcome depends on
   * the overlay type and whether the tooltip is the "second"
   * one in the dual-tooltip overlay.
   * @returns an offsets object
   */
  get overlayPositionStyle(): IAbsolutePosition {
    let leftOffset, topOffset

    switch (this.overlay) {
      // single rock
      case 'rock':
        topOffset = this.wrapperRect.top - this.contentRect.height + this.wrapperRect.height * 0.25
        leftOffset =
          this.wrapperRect.left + this.wrapperRect.width * 0.5 - this.contentRect.width * 0.5
        break

      // the pile's first talking rock
      case 'pile':
      case 'pile2':
        topOffset = this.wrapperRect.top - this.contentRect.height + this.wrapperRect.height / 6
        leftOffset =
          this.wrapperRect.left + this.wrapperRect.width * 0.35 - this.contentRect.width * 0.5
        break

      // second of the two talking rocks
      case 'second':
        topOffset =
          this.wrapperRect.top - this.contentRect.height + (this.wrapperRect.height * 1) / 3

        leftOffset =
          this.wrapperRect.left + (this.wrapperRect.width * 7) / 10 - this.contentRect.width / 2
        break

      default:
        topOffset = 0
        leftOffset = 0
        break
    }

    return {
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
    }
  }
}
</script>

<style lang="scss" scoped>
.hint {
  padding: 2px 6px 6px 6px;
  z-index: 2;
  max-width: 500px;
  position: absolute;
  color: #fff;
  font-size: 8px;
  @media screen and (min-width: $small) {
    font-size: 12px;
    padding: 8px;
  }
  @media screen and (min-width: $medium) {
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
