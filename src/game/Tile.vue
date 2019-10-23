<template>
  <svg @click="rotate">
    <g :style="calculatedStyle">
      <path
        d="M32.3 39L19.2 25H16l13.1 14zM62 39V25H21.8l13.1 14zM3.1 25H2v14h14.2z"
        fill="#5a4278"
      />
      <path
        v-if="cell.active"
        d="M29.1 39L16 25H3.1l13.1 14zm5.8 0L21.8 25h-2.6l13.1 14z"
        fill="red"
      />
      <path v-else d="M29.1 39L16 25H3.1l13.1 14zm5.8 0L21.8 25h-2.6l13.1 14z" fill="#7858a0" />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator';
import { ICell } from '@/types';

@Component({
  components: {}
})
export default class Tile extends Vue {
  @Prop() readonly cell!: ICell;
  @Prop() readonly lasers!: any[];
  cellSize = 64;

  get calculatedStyle() {
    let styleObj = {};
    const originX = this.centerCoord(this.cell.coord.x);
    const originY = this.centerCoord(this.cell.coord.y);
    if (this.cell.element !== 'Void') {
      styleObj = {
        'transform-origin': `${originX}px ${originY}px`,
        transform: `
				rotate(-${this.cell.rotation}deg)
				translate(${this.cell.coord.x * this.cellSize}px, ${this.cell.coord.y * this.cellSize}px)`
      };
    }
    return styleObj;
  }

  centerCoord(val: number) {
    return (val + 0.5) * this.cellSize;
  }

  /**
   * onClick rotate the element
   */
  rotate(): void {
    this.cell.rotation += 45;
    console.log('CURRENT ROTATION: ' + this.cell.rotation);
  }

  get translationX(): number {
    return this.cell.coord.x * this.cellSize;
  }
  get translationY(): number {
    return this.cell.coord.y * this.cellSize;
  }
}
</script>

<style lang="scss">
</style>
