<template>
  <svg class="grid" :width="totalWidth" :height="totalHeight">
    <!-- DOTS -->
    <g v-for="(row, y) in grid.rows" :key="y">
    	<g v-for="(column, x) in grid.cols" :key="x">
        <circle :cx="centerCoord(x)" :cy="centerCoord(y)" r="1" fill="#edeaf4" />
    	</g>
    </g>

		<!-- TILES -->
    <g class="cells" v-for="(cell, i) in grid.cells" :key="'cell' + i">
      <tile :cell="cell" :cellSize="cellSize" />
    </g>

    <!-- PHOTONS -->
    <g
      v-for="(particle, index) in particles"
      :key="index"
      :v-if="particles.length > 0"
      class="photons"
    >
      <photon
        name
        :intensity="particle.intensity"
        :are="particle.a.re"
        :aim="particle.a.im"
        :bre="particle.b.re"
        :bim="particle.b.im"
        :direction="particle.direction"
        :width="64"
        :height="64"
        :margin="0"
        :display-magnetic="true"
        :display-electric="false"
        :display-gaussian="false"
        :sigma="0.25"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Photon from './Photon.vue';
import { IGrid, ICell, Qparticle } from '@/types';
import Mirror from './pieces/Mirror.vue';
import Tile from './Tile.vue';
// import { PiecesList } from '../pieces/index';

@Component({
  components: {
    Photon,
    Tile
  }
})
export default class Grid extends Vue {
  cellSize: number = 64;
  grid: IGrid = {
    cols: 10,
    rows: 8,
    cells: [
      {
        coord: {
          x: 1,
          y: 1
        },
        element: 'Mirror',
        rotation: 0,
        frozen: false,
        active: false
      },
      {
        coord: {
          x: 5,
          y: 2
        },
        element: 'Mirror',
        rotation: 0,
        frozen: false,
        active: true
      }
    ]
  };

  get totalWidth(): number {
    return this.grid.cols * this.cellSize;
  }
  get totalHeight(): number {
    return this.grid.rows * this.cellSize;
  }

  particles(): Qparticle[] {
    return [
      {
        x: 4,
        y: 3,
        direction: 0,
        are: 1,
        aim: 0,
        bre: 0,
        bim: 0
      }
    ];
  }

  /**
   * Compute the cell center at a specific coordinate for grid dots
   * @returns x, y pixel coordinates
   */
  centerCoord(val: number) {
    return (val + 0.5) * this.cellSize;
  }

  // HELPING FUNCTIONS
  element(y: number, x: number): ICell {
    const cells = this.grid.cells.filter((cell: ICell) => cell.coord.x === x && cell.coord.y === y);
    if (cells.length > 0) {
      return cells[0];
    } else {
      return {
        coord: { x, y },
        element: 'Void',
        rotation: 0,
        frozen: false
      };
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
