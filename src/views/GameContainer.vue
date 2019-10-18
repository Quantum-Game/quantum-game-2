<template>
	<div class="game">
		<game-layout>
			<section slot="main">
				<h1 v-if="error" class="error">{{ error }}</h1>
				<h1 v-else class="title">{{ level.name.toUpperCase() }}</h1>
				<div class="grid">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<tile v-for="(column, x) in level.grid.cols" :key="x" :cell="isTherePiece(y, x)"></tile>
					</div>
				</div>
				<div id="player" />
				<p id="cell"></p>
				<p id="quantum"></p>
				<p id="laser"></p>
				<!-- <board @setActiveElement="onActiveElement" /> -->
				<q-button :inline="true" @click="createNexFrame">create a frame</q-button>
				<span> number of frames: {{ frames.length }}</span>
				<simulation-steps-display :frames="frames" />
			</section>
		</game-layout>
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
import cloneDeep from 'lodash.clonedeep';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Level, Frame } from 'quantumweasel';
import GameLayout from '../layouts/GameLayout.vue';
import Piece from '../components/Piece.vue';
import SimulationStepsDisplay from '../components/SimulationStepsDisplay.vue';
import { ICell, ICoord, FrameInterface } from '@/types';
import levelData from '../game/levels';
import Tile from '../components/Tile.vue';
import QButton from '../components/QButton.vue';


// @ts-ignore
// import Grid from '../components/Grid.vue';
// import { Board, Toolbox } from '../components';
// import { Photons } from 'quantum-tensors';
// import { IPhotonState, IGameState, IFrame, ICell, ILevel } from '@/types';
// import Game from '../game/Game';

@Component({
	components: {
		GameLayout,
		Piece,
		SimulationStepsDisplay,
		Tile,
		QButton
		// Grid,
		// Board,
		// Toolbox
	}
})
export default class GameContainer extends Vue {
	level = {
		grid: {
			cols: 0,
			rows: 0,
			cells: [
				{
					coord: {
						x: -1,
						y: -1
					},
					element: '',
					rotation: 0,
					frozen: false
				}
			]
		}
	};
	error: string = '';
	game = {};
	activeElement = '';
	frames: FrameInterface[] = [];
	activeFrameNumber: number = 0;

	get activeFrame() {
		return this.frames[this.activeFrameNumber];
	}

	get lastFrame(): FrameInterface {
		return this.frames[this.frames.length - 1];
	}

	created() {
		this.loadALevel();
		const levelWhatever = Level.importLevel(this.level);
		const initFrame = new Frame(levelWhatever);
		const firstFrame: FrameInterface = initFrame.next();
		this.frames.push(firstFrame);
	}

	createNexFrame() {
		const lastFrameCopy = cloneDeep(this.lastFrame);
		const nextFrame: FrameInterface = lastFrameCopy.next();
		this.frames.push(nextFrame);
	}

	showNextFrame() {
		if (this.activeFrameNumber > this.frames.length) {
			this.createNexFrame();
		}
		this.activeFrameNumber += 1;
	}

	showPreviousFrame() {
		const previousFrameNumber = this.activeFrameNumber - 1;
		if (previousFrameNumber < 0) return;
		this.activeFrameNumber = previousFrameNumber;
	}

	loadALevel() {
		this.error = '';
		// See if there's such level:
		const typedLevel = levelData;
		const levelToLoad = typedLevel[this.currentLevelName];
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
.game {
	width: 100%;
}
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
