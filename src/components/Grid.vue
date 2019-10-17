<template>
	<!-- <h1 class="text-center text-white">
    {{ title }}
  </h1> -->
	<div
		class="game-grid columns"
		@mousedown="isMouseDown = true"
		@mouseup="isMouseDown = false"
		@mouseleave="isMouseDown = false"
	>
		<div v-for="(col, indexX) in width" :key="indexX" class="game-column">
			<cell
				v-for="(row, indexY) in height"
				:key="indexX * width + indexY"
				:x="indexX"
				:y="indexY"
				:frozen="grid[indexX][indexY].frozen"
				:element="grid[indexX][indexY].element"
				:rotation="grid[indexX][indexY].rotation"
			/>
		</div>
		<!-- <controls /> -->
	</div>
</template>

<script>
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Cell from './Cell.vue';
// import Controls from './Controls'

@Component({
	components: {
		Cell
	}
})
export default class Grid extends Vue {
	title = 'I - Yt+ is so friendly';
	width = 10;
	height = 10;
	grid = [];
	particles = [];
	currentFrame = 0;
	isMouseDown = false;
	jsonCells = [
		{ x: 1, y: 4, element: 'laser', frozen: false, rotation: 180 },
		{ x: 4, y: 4, element: 'beamsplitter', frozen: false, rotation: 180 },
		{ x: 7, y: 4, element: 'detector', frozen: true, rotation: 180 },
		{ x: 4, y: 7, element: 'detector', frozen: true, rotation: 270 }
	];
	created() {
		// Create array of cells with empty elements
		for (let x = 0; x < this.width; x + 1) {
			this.grid[x] = [];
			for (let y = 0; y < this.height; y + 1) {
				this.grid[x][y] = { element: 'void', frozen: false, rotation: 0 };
				const cell = this.isCoordInJson(x, y);
				if (cell && y === cell.y && x === cell.x) {
					this.grid[x][y] = { element: cell.element, frozen: cell.frozen, rotation: cell.rotation };
				}
			}
		}
	}

	getCell(x, y) {
		return this.grid[x][y];
	}

	setCell(x, y, info) {
		this.grid[x][y] = info;
	}

	isCoordInJson(x, y) {
		const cells = this.jsonCells.filter((cell) => {
			return x === cell.x && y === cell.y;
		});
		if (cells.length > 0) {
			// console.log(cells);
		}
		return cells[0];
	}

	compareCoords(x1, y1, x2, y2) {
		return x1 === x2 && y1 === y2;
	}

	includedInCells(x, y) {
		this.cells.forEach((cell) => {
			if (this.compareCoords(x, y, cell.x, cell.y)) {
				return true;
			}
			return false;
		});
	}
}
</script>

<style lang="scss">
.game-grid {
	// border-top: 1px solid #1a0707;
	// border-left: 1px solid #1a0707;
	display: flex;
	flex: 1;
	justify-content: center;
}
.game-column {
	// flex: 1;
	// display: flex;
	justify-content: center;
	// padding: 0;
	// margin: 0 auto;
	flex-direction: column;
}
// .grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
//   grid-auto-rows: 1fr;
// }

// .grid::before {
//   content: '';
//   width: 0;
//   padding-bottom: 100%;
//   grid-row: 1 / 1;
//   grid-column: 1 / 1;
// }

// .grid > *:first-child {
//   grid-row: 1 / 1;
//   grid-column: 1 / 1;
// }

/* Just to make the grid visible */
// .grid > * {
//   background: rgba(0,0,0,0.1);
//   border: 1px white solid;
// }
</style>
