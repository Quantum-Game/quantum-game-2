<template>
	<div class="game">
		<game-layout>
			<h1 v-if="error" slot="header-middle" class="error">{{ error }}</h1>
			<h1 v-else slot="header-middle" class="title">{{ level.name.toUpperCase() }}</h1>
			<Goals slot="main-left" />
			<section slot="main-middle">
				<div class="grid">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<tile v-for="(column, x) in level.grid.cols" :key="x" :cell="isTherePiece(y, x)"></tile>
					</div>
				</div>
				<div class="placeholder controls">
					<h3 class="title">here go the controls<br />⬇ ️ ⬇ ️ ⬇️</h3>
					<q-button inline @click.native="createNexFrame">create a frame</q-button>
				</div>
				<!-- <board @setActiveElement="onActiveElement" /> -->
			</section>
			<section slot="main-right">
				<!-- <toolbox :initial-tools="initialTools" @setActiveElement="onActiveElement" /> -->
				<toolbox />
				<explanation>
					<div class="discription">
						<span>element: {{ activeElement }}</span>
					</div>
				</explanation>
				<your-photon :frames="frames" />
			</section>
		</game-layout>
	</div>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Level, Frame } from 'quantumweasel';
import GameLayout from '../layouts/GameLayout.vue';
import { ICell, ICoord, FrameInterface } from '@/types';
import levelData from '../game/levels';
import QButton from '../components/QButton.vue';
import { Goals, Explanation, Toolbox, Controls, Piece, Tile, YourPhoton } from '../game';

@Component({
	components: {
		GameLayout,
		Piece,
		YourPhoton,
		Tile,
		QButton,
		Goals,
		Explanation,
		Toolbox,
		Controls
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

<style lang="scss" scoped>
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
