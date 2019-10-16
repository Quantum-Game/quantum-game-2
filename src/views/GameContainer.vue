<template>
	<div class="game">
		<main-layout>
			<section slot="main">
				<h1 v-if="error" class="error">{{ error }}</h1>
				<h1 v-else class="title">{{ level.name.toUpperCase() }}</h1>
				<div class="grid">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<div v-for="(column, x) in level.grid.cols" :key="x" class="tile">
							<piece v-if="isTherePiece(y, x)" :cell="isTherePiece(y, x)" :disabled="isTherePiece(y, x).frozen" />
						</div>
					</div>
				</div>
				<!-- <board @setActiveElement="onActiveElement" /> -->
			</section>
		</main-layout>
		<!-- <section class="right">
			<toolbox :initial-tools="initialTools" @setActiveElement="onActiveElement" />
			<div class="explanation-placeholder">
				<h3 class="title">stuff will be taking place here<br />⬇ ️ ⬇ ️ ⬇️</h3>
				<div class="discription">
					<span>element: {{ activeElement }}</span>
				</div>
			</div>
		</section> -->
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Level } from 'quantumweasel';
import levelData from '../game/levels';
import MainLayout from '../layouts/MainLayout.vue';
import Piece from '../components/Piece.vue';
import { ICell, ICoord } from '@/types';
// @ts-ignore
// import Grid from '../components/Grid.vue';
// import { Board, Toolbox } from '../components';
// import { Photons } from 'quantum-tensors';
// import { IPhotonState, IGameState, IFrame, ICell, ILevel } from '@/types';
// import Game from '../game/Game';

export interface ILevelList {
	[index: string]: ILevel;
}

interface ILevel {
	grid: {
		cols: number;
		rows: number;
		cells: Array<ICell>;
	};
}

@Component({
	components: {
		MainLayout,
		Piece
		// Grid,
		// Board,
		// Toolbox
	}
})
export default class GameContainer extends Vue {
	level: ILevel = {
		grid: {
			cols: 0,
			rows: 0,
			cells: []
		}
	};
	error: string = '';
	game = {};
	activeElement = '';

	created() {
		this.loadALevel();
		const levelX = new Level();
		console.log(levelX);
	}
	loadALevel() {
		this.error = '';
		// See if there's such level:
		// const typedLevel:ILevelList = <ILevelList> levelData;
		const levelToLoad: ILevel = levelData[this.currentLevelName];
		if (!levelToLoad) {
			this.error = 'no such level!';
			return false;
		}
		this.level = levelToLoad;
		return true;
	}
	get currentLevelName() {
		return `level${parseInt(this.$route.params.id, 10)}`;
	}

	// helps to determine if there is a element present
	isTherePiece(y: number, x: number) {
		if (this.level && this.level.grid) {
			const possiblePieceArray = this.level.grid.cells.filter((cell: ICell) => cell.coord.x === x && cell.coord.y === y);
			if (possiblePieceArray.length) {
				return possiblePieceArray[0];
			}
			return false;
		}
		return false;
	}
	// original Game TS class functionality:
	// laserPath: Array<IPhotonState> = [];
	// gameState: IGameState = {
	// 	achievedGoals: false,
	// 	noPointers: false,
	// 	notEnoughIntensity: false
	// };
	// game = new Game();
	// game = new Game();
	// frames: Array<IFrame> = [];
	// menuOpen: boolean = false;
	// initialTools: Array<ICell> = [];
	// initialBoard: { cells: Array<ICell>; rows: number; cols: number } = {
	// 	cells: [],
	// 	rows: 0,
	// 	cols: 0
	// };
	// actualGame = {};
	// this.level = new Level();
	// serveInitialItems() {
	// 	const { cells, rows, cols } = this.level;
	// 	this.initialTools = cells.filter((cell: ICell) => !cell.frozen);
	// 	this.initialBoard = { cells: cells.filter((cell: ICell) => cell.frozen), rows, cols };
	// }
	// @Watch('levelNumber')
	// updateLevelData(val: number) {
	// 	this.loadALevel(val);
	// }
	onActiveElement(element: string, isDraggable: boolean) {
		this.activeElement = element;
	}
}
</script>

<style lang="scss">
.grid {
	width: 100%;
	max-height: 100vh;
	.row {
		display: flex;
		flex-direction: row;
		& .tile {
			background-color: rgba(0, 98, 255, 0.294);
			width: 64px;
			min-height: 64px;
			// background-color: #0e377815;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: white;
			font-size: 1.3rem;
			&:hover {
				background-color: yellow;
				color: black;
			}
		}
	}
}
</style>
