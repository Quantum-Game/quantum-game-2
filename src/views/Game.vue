<template>
	<div class="game">
		<game-layout>
			<h1 v-if="error" slot="header-middle" class="error">{{ error }}</h1>
			<h1 v-else slot="header-middle" class="title">{{ level.name.toUpperCase() }}</h1>
			<Goals slot="main-left" />
			<h3 class="title" slot="main-left">LEVELS:</h3>
			<ul slot="main-left">
				<li v-for="(stuff, i) in Array(20)" :key="i">
					<router-link class="level" :to="`/level/${i + 1}`">Level {{ i + 1 }}</router-link>
				</li>
			</ul>
			<section slot="main-middle">
				<div class="grid">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<tile
							v-for="(column, x) in level.grid.cols"
							:key="x"
							:cell="isTherePiece(y, x)"
							:particles="isTherePhotons(y, x)"
						></tile>
					</div>
				</div>
				<controls>
					<!-- <q-button inline @click.native="createNextFrame">create a frame</q-button> -->
					<q-button inline @click.native="createFrames">create frames</q-button>
					<q-button inline @click.native="showPrevious">show previous frame</q-button>
					<q-button inline @click.native="showNext">show next frame</q-button>
					<h3>Total frames: {{ frames.length }}</h3>
				</controls>
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
				<your-photon :active-frame="activeFrame" />
			</section>
		</game-layout>
	</div>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Level, Frame, Particle } from 'quantumweasel';
import GameLayout from '../layouts/GameLayout.vue';
import { ICell, ICoord, FrameInterface } from '@/types';
import levelData from '../game/levels';
import QButton from '../components/QButton.vue';
import { Piece, Tile } from '../game';
import { Goals, Explanation, Toolbox, Controls, YourPhoton } from '../game/sections';

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
					element: 'Void',
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
	frameNumber: number = 0;

	get activeFrame(): FrameInterface {
		return this.frames[this.frameNumber];
	}

	get lastFrame(): FrameInterface {
		return this.frames[this.frames.length - 1];
	}

	created() {
		this.loadALevel();
		this.frames = [];
		this.frameNumber = 0;
		const levelWhatever = Level.importLevel(this.level);
		const initFrame = new Frame(levelWhatever);
		const firstFrame: FrameInterface = initFrame.next();
		this.frames.push(firstFrame);
		this.createFrames();
		window.addEventListener('keyup', this.handleArrowPress);
	}

	createFrames(number = 20) {
		for (let index = 0; index < number; index += 1) {
			const lastFrameCopy = cloneDeep(this.lastFrame);
			const nextFrame: FrameInterface = lastFrameCopy.next();
			this.frames.push(nextFrame);
		}
	}

	createNextFrame() {
		const lastFrameCopy = cloneDeep(this.lastFrame);
		const nextFrame: FrameInterface = lastFrameCopy.next();
		this.frames.push(nextFrame);
	}

	showNext() {
		const newFrameNumber = this.frameNumber + 1;
		if (newFrameNumber > this.frames.length - 1) {
			console.error("Can't access frames that are not computed yet...");
			return false;
		}
		this.frameNumber = newFrameNumber;
		return this.frameNumber;
	}

	handleArrowPress(e: { keyCode: number }) {
		console.log(e.keyCode);

		switch (e.keyCode) {
			case 37:
				this.showPrevious();
				break;
			case 39:
				this.showNext();
				break;
			default:
				break;
		}
	}

	beforeDestroy() {
		window.removeEventListener('keyup', this.handleArrowPress);
	}

	showPrevious() {
		const newFrameNumber = this.frameNumber - 1;
		if (newFrameNumber < 0) {
			console.error("Can't access frames before simulation...");
			return false;
		}
		this.frameNumber = newFrameNumber;
		return this.frameNumber;
	}

	@Watch('$route')
	loadALevel() {
		// this.frames = [];
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

	get levelLoaded(): boolean {
		return this.level && this.level.grid.cols !== 0;
	}

	get particles() {
		return this.frames[this.frameNumber].quantum;
	}

	// helps to determine if there is a element present
	isTherePiece(y: number, x: number) {
		if (this.levelLoaded) {
			const possiblePieceArray = this.level.grid.cells.filter(
				(cell: ICell) => cell.coord.x === x && cell.coord.y === y
			);
			if (possiblePieceArray.length) {
				return possiblePieceArray[0];
			}
			return false;
		}
		return false;
	}

	// helps to determine if there is a element present
	isTherePhotons(y: number, x: number) {
		if (this.levelLoaded) {
			const particles = this.frames[this.frameNumber].quantum;
			return particles.filter((particle) => particle.coord.x === x && particle.coord.y === y);
		}
		return [];
	}

	onActiveElement(element: string, isDraggable: boolean) {
		this.activeElement = element;
	}
}
</script>

<style lang="scss" scoped>
.game {
	width: 100%;
	min-height: 100vh;
}
.grid {
	width: 100%;
	max-height: 100vh;
	.row {
		display: flex;
		flex-direction: row;
		& .tile {
			// background-color: rgba(0, 98, 255, 0.294);
			background-color: #280066;
			width: 64px;
			min-height: 64px;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: white;
			font-size: 1.3rem;
			&:hover {
				background-color: purple;
				color: black;
			}
		}
	}
}
.game {
	&.goals {
		background-color: rgba(255, 0, 85, 0.349);
		height: 600px;
		a:link,
		a:visited {
			color: white;
			font-size: 12;
			text-decoration: none;
		}
	}
}
</style>
