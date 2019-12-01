<template>
  <svg class="operator-viewer" :width="width" :height="height">
    <g class="labels-in" :transform="`translate(${1.5 * margin}, ${0.5 * margin})`">
      <text
        v-for="(label, i) in labelsIn"
        :key="`label-in-${label}`"
        class="label-in"
        :x="scale(i)"
        :y="0"
      >
        ⟨{{ label }}|
      </text>
    </g>
    <g class="labels-out" :transform="`translate(${0.5 * margin}, ${1.5 * margin})`">
      <text
        v-for="(label, i) in labelsOut"
        :key="`label-out-${label}`"
        class="label-out"
        :x="0"
        :y="scale(i)"
        dy="0.5em"
      >
        |{{ label }}⟩
      </text>
    </g>
    <g :transform="`translate(${margin}, ${margin})`">
      <rect
        v-for="(d, i) in matrixElements"
        :key="i"
        class="tile"
        :x="scale(d.i)"
        :y="scale(d.j)"
        :width="size"
        :height="size"
        :style="{ fill: generateColor(d.re, d.im) }"
        @mouseover="tileMouseOver(d)"
      />
    </g>
  </svg>
</template>

<script lang="ts">
// TODO: Allow to hover an empty column to see results
// FIXME: Changing will reset the chosen cartesian/polar/color-disk (option menu?)
import { Component, Prop, Vue } from 'vue-property-decorator'
import { colorComplex } from '@/engine/Helpers'
import { MatrixElementInterface } from '../../engine/interfaces'

@Component
export default class EncyclopediaOperatorViewer extends Vue {
  @Prop({ default: () => 800 }) private width!: number
  @Prop({ default: () => 600 }) private height!: number
  @Prop({ default: () => 40 }) private size!: number
  @Prop({ default: () => 40 }) private margin!: number
  @Prop({ default: () => [] }) private labelsIn!: number[]
  @Prop({ default: () => [] }) private labelsOut!: number[]
  @Prop({ default: () => [] }) private matrixElements!: MatrixElementInterface[]

  scale(i: number): number {
    return i * this.size
  }

  generateColor(re: number, im: number): string {
    return colorComplex(re, im)
  }

  tileMouseOver(tile: MatrixElementInterface): void {
    this.$emit('columnMouseover', tile.i)
  }
}
</script>

<style scoped lang="scss">
.operator-viewer {
  display: inline-block;
}

.label-in,
.label-out {
  font-size: 16px;
  text-align: center;
  text-anchor: middle;
  fill: white;
}

.tile {
  cursor: pointer;
}
</style>
