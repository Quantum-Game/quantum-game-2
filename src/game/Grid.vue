<template>
  <div class="grid" :style="computedGridStyle">
    <div v-for="(row, y) in gridData.rows" :key="y" class="row">
      <tile
        v-for="(column, x) in gridData.cols"
        :key="x"
        :cell="isTherePiece(y, x)"
      ></tile>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Tile from './Tile.vue';
import { IGrid } from '@/types';


const emptyGrid = {
  cols: 0,
  rows: 0,
  cells: [
    {
      coord: {
        x: -1,
        y: -1
      },
      element: 'Void',
      rotation: 0,
      frozen: false
    }
  ]
}

@Component({
  components: {
    Tile
  }
})
export default class Grid extends Vue {
  @Prop() readonly gridData!: IGrid;

  grid = this.gridData;

  updated() {
    // console.log(this.grid);
    this.grid = this.gridData
  }

  get computedGridStyle() {
		return {
			// backgroundImage: `url(${gridSVG})`
		};
  }

  isTherePiece(y: number, x: number) {
		if (this.gridData.cells.length > 1) {
			const possiblePieceArray = this.grid.cells.filter(
				(cell: ICell) => cell.coord.x === x && cell.coord.y === y
			);
			if (possiblePieceArray.length) {
				return possiblePieceArray[0];
			}
			return false;
		}
		return false;
  }

	isTherePhotons(y: number, x: number) {
		if (this.gridData.cells.length > 1) {
			const particles = this.frames[this.frameNumber].quantum;
			return particles.filter((particle) => particle.coord.x === x && particle.coord.y === y);
		}
		return [];
	}

}
</script>

<style lang="scss">
.grid {
	width: 100%;
	max-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	.row {
		display: flex;
		flex-direction: row;
		& .tile {
			width: 64px;
			min-height: 64px;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: white;
			font-size: 1rem;
			margin: none;
			&:hover {
				color: black;
			}
		}
	}
}
</style>