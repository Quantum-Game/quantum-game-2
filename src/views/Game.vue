<template>
	<div class="game">
		<game-layout>
			<h1 v-if="error" class="error" slot="header-middle">{{ error }}</h1>
			<h1 v-else class="title" slot="header-middle">{{ level.name.toUpperCase() }}</h1>
			<div class="goals placeholder" slot="main-left">
				<h3 class="title">GOALS:<br />⬇ ️ ⬇ ️ ⬇️</h3>
			</div>
			<section slot="main-middle">
				<div class="grid">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<tile v-for="(column, x) in level.grid.cols" :key="x" :cell="isTherePiece(y, x)"></tile>
					</div>
				</div>
				<div class="placeholder controls">
					<h3 class="title">here go the controls<br />⬇ ️ ⬇ ️ ⬇️</h3>
				</div>
				<!-- <board @setActiveElement="onActiveElement" /> -->
				<q-button inline @click.native="createNexFrame">create a frame</q-button>
				<simulation-steps-display :frames="frames" />
			</section>
		<section slot="main-right">
			<div class="toolbox placeholder">
				<h3 class="title">here's the toolbox!<br />⬇ ️ ⬇ ️ ⬇️</h3>
			</div>
			<!-- <toolbox :initial-tools="initialTools" @setActiveElement="onActiveElement" /> -->
			<div class="explanation placeholder" >
				<h3 class="title">stuff will be explained here<br />⬇ ️ ⬇ ️ ⬇️</h3>
				<div class="discription">
					<span>element: {{ activeElement }}</span>
				</div>
			</div>
		</section>
		</game-layout>
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

@Component({
	components: {
		GameLayout,
		Piece,
		SimulationStepsDisplay,
		Tile,
		QButton
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

.placeholder {
	width: 100%;
	height: 200px;
	& h3 {
		margin: 0;
	}
	&.explanation {
		background-color: rgba(0, 225, 255, 0.349);
	}
	&.toolbox {
		background-color: rgba(255, 187, 0, 0.349);
	}
	&.goals {
		background-color: rgba(255, 0, 85, 0.349);
		height: 400px;
	}
	&.controls {
		background-color: rgba(179, 255, 0, 0.349);
		height: 100px;
	}
}

.toolbox-container {
	width: 100%;
	background-color: rgba(0, 225, 255, 0.349);
	height: 200px;
}
</style>
