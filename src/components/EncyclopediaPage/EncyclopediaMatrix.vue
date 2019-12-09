<template>
  <svg class="operator-viewer" :width="width" :height="height">
    <g class="labels-in" :transform="`translate(${2 * size}, ${0})`">
      <rect
        v-for="(label, i) in labelsIn"
        :key="`menu-tile-out-1-${i}`"
        class="menu-tile"
        :x="scale(i)"
        :y="scale(0)"
        :width="size"
        :height="size"
      />
      <text
        v-for="(label, i) in labelsIn"
        :key="`label-in-1-${label}`"
        class="label-in"
        :x="scale(i + 0.5)"
        :y="scale(0.5)"
      >
        {{ label[0] }}
      </text>
      <rect
        v-for="(label, i) in labelsIn"
        :key="`menu-tile-out-2-${i}`"
        class="menu-tile"
        :x="scale(i)"
        :y="scale(1)"
        :width="size"
        :height="size"
      />
      <text
        v-for="(label, i) in labelsIn"
        :key="`label-in-2-${label}`"
        class="label-in"
        :x="scale(i + 0.5)"
        :y="scale(1.5)"
      >
        {{ label[1] }}
      </text>
    </g>
    <g class="labels-out" :transform="`translate(${0}, ${2 * size})`">
      <rect
        v-for="(label, j) in labelsIn"
        :key="`menu-tile-in-1-${j}`"
        class="menu-tile"
        :x="scale(0)"
        :y="scale(j)"
        :width="size"
        :height="size"
      />
      <text
        v-for="(label, j) in labelsIn"
        :key="`label-out-1-${label}`"
        class="label-out"
        :x="scale(0.5)"
        :y="scale(j + 0.5)"
      >
        {{ label[0] }}
      </text>
      <rect
        v-for="(label, j) in labelsIn"
        :key="`menu-tile-in-2-${j}`"
        class="menu-tile"
        :x="scale(1)"
        :y="scale(j)"
        :width="size"
        :height="size"
      />
      <text
        v-for="(label, j) in labelsIn"
        :key="`label-out-2-${label}`"
        class="label-out"
        :x="scale(1.5)"
        :y="scale(j + 0.5)"
      >
        {{ label[1] }}
      </text>
    </g>

    <g :transform="`translate(${2 * size}, ${2 * size})`">
      <rect
        v-for="d in allTileLocations"
        :key="`entry-tile-${d.i}-${d.j}`"
        class="entry-tile"
        :x="scale(d.i)"
        :y="scale(d.j)"
        :width="size"
        :height="size"
        @mouseover="tileMouseOver(d)"
      />
      <rect class="entry-boarder" :x="0" :y="0" :width="columnSize" :height="rowSize" />
      <circle
        v-for="d in matrixElements"
        :key="`circle-${d.i}-${d.j}`"
        class="tile-value"
        :cx="scale(d.i + 0.5)"
        :cy="scale(d.j + 0.5)"
        :r="r(d.re, d.im)"
        :style="{ fill: generateColor(d.re, d.im) }"
        @mouseover="tileMouseOver(d)"
      />
      <rect
        v-if="selectedColumn > -1"
        class="selected-column"
        :x="scale(selectedColumn)"
        :y="0"
        :width="size"
        :height="columnSize"
      />
    </g>
  </svg>
</template>

<script lang="ts">
// TODO: Allow to hover an empty column to see results
// FIXME: Changing will reset the chosen cartesian/polar/color-disk (option menu?)
import { Component, Prop, Vue } from 'vue-property-decorator'
import { colorComplex } from '@/engine/Helpers'
import { IMatrixElement } from '../../engine/interfaces'

@Component
export default class EncyclopediaOperatorViewer extends Vue {
  @Prop({ default: () => 800 }) private width!: number
  @Prop({ default: () => 600 }) private height!: number
  @Prop({ default: () => 40 }) private size!: number
  @Prop({ default: () => 40 }) private margin!: number
  @Prop({ default: () => [] }) private labelsIn!: string[]
  @Prop({ default: () => [] }) private labelsOut!: string[]
  @Prop({ default: () => [] }) private matrixElements!: IMatrixElement[]
  // TODO: reduce width and height

  selectedColumn = -1

  // lablesIn string[][] ?

  get columnSize(): number {
    return this.size * this.labelsIn.length
  }

  get rowSize(): number {
    return this.size * this.labelsOut.length
  }

  get allTileLocations(): { i: number; j: number }[] {
    return this.labelsOut.flatMap((_, j) => this.labelsIn.map((_, i) => ({ i, j })))
  }

  scale(i: number): number {
    return i * this.size
  }

  generateColor(re: number, im: number): string {
    return colorComplex(re, im)
  }

  r(re: number, im: number): number {
    return 0.5 * this.size * Math.sqrt(re ** 2 + im ** 2)
  }

  tileMouseOver(tile: IMatrixElement): void {
    this.selectedColumn = tile.i
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
  dominant-baseline: central;
  text-anchor: middle;
  fill: white;
  cursor: pointer;
}

.selected-column {
  fill: none;
  stroke: #ffffff;
  stroke-width: 1.5px;
}

.entry-tile,
.menu-tile {
  fill: #2e006a; // to Klem: which color should we use?
  stroke: #5c00d3;
  stroke-width: 0.5px;
}

.entry-boarder {
  fill: none;
  stroke: #5c00d3;
  stroke-width: 1.5px;
}

.tile-value {
  cursor: pointer;
}
</style>
