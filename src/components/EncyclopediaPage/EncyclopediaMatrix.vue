<template>
  <svg class="operator-viewer" :width="columnSize + 3.5 * size" :height="rowSize + 6.5 * size">
    <g class="labels-in" :transform="`translate(${3 * size}, ${1 * size})`">
      <text class="label" :x="rowSize / 2" :y="scale(-0.25)">
        Input
      </text>
      <text
        v-for="(coord, i) in coordNamesIn[0]"
        :key="`label-in-1-${coord}`"
        class="label-in"
        :x="scale(coordNamesIn[1].length * (i + 0.5))"
        :y="scale(0.5)"
      >
        {{ coord }}
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
      <rect
        v-for="(coord, i) in coordNamesIn[0]"
        :key="`menu-tile-out-1-${i}`"
        class="menu-tile-head"
        :x="scale(coordNamesIn[1].length * i)"
        :y="scale(0)"
        :width="coordNamesIn[1].length * size"
        :height="2 * size"
      />
    </g>
    <g class="labels-out" :transform="`translate(${1 * size}, ${3 * size})`">
      <text class="label" :transform="`translate(${scale(-0.25)},${columnSize / 2}) rotate(270)`">
        Output
      </text>
      <text
        v-for="(coord, j) in coordNamesOut[0]"
        :key="`label-out-1-${coord}`"
        class="label-out"
        :x="scale(0.5)"
        :y="scale(coordNamesOut[1].length * (j + 0.5))"
      >
        {{ coord }}
      </text>
      <rect
        v-for="(label, j) in labelsOut"
        :key="`menu-tile-in-2-${j}`"
        class="menu-tile"
        :x="scale(1)"
        :y="scale(j)"
        :width="size"
        :height="size"
      />
      <text
        v-for="(label, j) in labelsOut"
        :key="`label-out-2-${label}`"
        class="label-out"
        :x="scale(1.5)"
        :y="scale(j + 0.5)"
      >
        {{ label[1] }}
      </text>
      <rect
        v-for="(coord, j) in coordNamesOut[0]"
        :key="`menu-tile-in-1-${j}`"
        class="menu-tile-head"
        :x="scale(0)"
        :y="scale(coordNamesOut[1].length * j)"
        :width="2 * size"
        :height="coordNamesOut[1].length * size"
      />
      <g class="dimension-labels" @click="swapDimensions()">
        <text
          v-for="(dimensionName, j) in dimensionNames"
          :key="`label-${dimensionName}`"
          :transform="`translate(${scale(j + 0.5)},${columnSize + scale(0.25)}) rotate(270)`"
          class="dimension-label"
        >
          {{ dimensionName }}
        </text>
        <text
          :transform="`translate(${scale(1)},${columnSize + scale(1.25)})`"
          class="dimension-swap"
        >
          ⇄
        </text>
      </g>
    </g>

    <g :transform="`translate(${3 * size}, ${3 * size})`">
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { colorComplex } from '@/engine/Helpers'
import { IMatrixElement } from '../../engine/interfaces'

@Component
export default class EncyclopediaOperatorViewer extends Vue {
  @Prop({ default: () => 40 }) private size!: number
  @Prop({ default: () => [] }) private coordNamesIn!: string[][]
  @Prop({ default: () => [] }) private coordNamesOut!: string[][]
  @Prop({ default: () => [] }) private dimensionNames!: string[]
  @Prop({ default: () => [] }) private matrixElements!: IMatrixElement[]

  selectedColumn = -1

  /**
   * @todo Flattening should be in QT.Dimension.
   * Here I do only for 2 dims.
   */
  get labelsIn(): string[] {
    const [names1, names2] = this.coordNamesIn
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`))
  }

  /**
   * @see {@link labelsIn}
   */
  get labelsOut(): string[] {
    const [names1, names2] = this.coordNamesOut
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`))
  }

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

  /**
   * @todo Show directly on the legend.
   */
  tileMouseOver(tile: IMatrixElement): void {
    this.selectedColumn = tile.i
    this.$emit('columnMouseover', tile.i)
  }

  /**
   * @todo Make all dimension changes within this component.
   * (After using Operator rather than passed parameteres.)
   */
  swapDimensions(): void {
    this.$emit('swapDimensions')
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
  cursor: default;
}

.dimension-label {
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  fill: white;
  cursor: pointer;
  text-transform: uppercase;
}

.dimension-swap {
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: central;
  fill: white;
  cursor: pointer;
  text-transform: uppercase;
}

.label {
  font-size: 12px;
  text-anchor: middle;
  fill: white;
  cursor: default;
  text-transform: uppercase;
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

.entry-boarder,
.menu-tile-head {
  fill: none;
  stroke: #5c00d3;
  stroke-width: 1.5px;
}

.tile-value {
  cursor: pointer;
}
</style>
