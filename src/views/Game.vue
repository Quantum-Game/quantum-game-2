<template>
	<div class="game">
		<overlay :game-state="gameState" @click.native="frameNumber = 0" />
		<game-layout>
			<h1 v-if="error" slot="header-middle" class="error">{{ error }}</h1>
			<h1 v-else slot="header-middle" class="title">
				<router-link :to="`/level/${parseInt(this.$route.params.id, 10) - 1}`">
					<img src="@/assets/prevIcon.svg" alt="Previous Level" width="32" />
				</router-link>
				{{ level.name.toUpperCase() }}
				<router-link :to="`/level/${parseInt(this.$route.params.id, 10) + 1}`">
					<img src="@/assets/nextIcon.svg" alt="Next Level" width="32" />
				</router-link>
			</h1>
			<Goals slot="main-left" :percentage="70" />
			<h3 slot="main-left" class="title">LEVELS:</h3>
			<ul slot="main-left">
				<li v-for="(stuff, i) in Array(20)" :key="i">
					<router-link class="level" :to="`/level/${i + 1}`">Level {{ i + 1 }}</router-link>
				</li>
			</ul>
			<section slot="main-middle">
				<div class="grid" :style="computedGridStyle">
					<div v-for="(row, y) in level.grid.rows" :key="y" class="row">
						<tile
							v-for="(column, x) in level.grid.cols"
							:key="x"
							:cell="isTherePiece(y, x)"
							:particles="isTherePhotons(y, x)"
							:lasers="isThereLasers(y, x)"
						></tile>
					</div>
				</div>
				<controls @stepBack="showPrevious" @stepForward="showNext" />
				<p>Total frames: {{ frames.length }}</p>
			</section>
			<section slot="main-right">
				<toolbox :tools="toolboxElements" />
				<explanation>
					<div class="description">
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
import { ICell, ICoord, FrameInterface, ParticleInterface } from '@/types';
import levelData from '../game/levels';
import QButton from '../components/QButton.vue';
import { Piece, Tile } from '../game';
import { Goals, Explanation, Toolbox, Controls, YourPhoton } from '../game/sections';
import gridSVG from '../assets/board_dots.svg';
import Overlay from '../game/overlays/Overlay.vue';

const emptyLevel = {
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
		Controls,
		Overlay
	}
})
export default class Game extends Vue {
  level = emptyLevel;
  error: string = '';
  game = {};
  activeElement = '';
  frameNumber: number = 0;
	frames: FrameInterface[] = [];
	goals = [];
  lasers = [];
  toolbox = [];

	// LIFECYCLE
	created() {
		this.loadALevel();
		window.addEventListener('keyup', this.handleArrowPress);
	}

	beforeDestroy() {
		window.removeEventListener('keyup', this.handleArrowPress);
	}

	// LEVEL LOADING
	@Watch('$route')
	loadALevel() {
		this.error = '';
		// See if there's such level:
		const levelToLoad = levelData[this.currentLevelName];
		if (!levelToLoad) {
			this.error = 'no such level!';
			return false;
		}
		this.level = levelToLoad;
		this.setupInitFrame();
		this.createFrames();
		return true;
	}

  setupInitFrame() {
    this.frames = [];
    this.frameNumber = 0;
    const loadedLevel = Level.importLevel(this.level);
		this.lasers = loadedLevel.grid.computePaths();
		this.goals = loadedLevel.goals
    console.log(`LASERS: ${this.lasers.length}`);

		const initFrame = new Frame(loadedLevel);
		const firstFrame: FrameInterface = initFrame.next();
		this.frames.push(firstFrame);
	}

	// FRAME CONTROL
	// TODO: Find the correct amount of frames to compute for the simulation
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

	showPrevious() {
		const newFrameNumber = this.frameNumber - 1;
		if (newFrameNumber < 0) {
			console.error("Can't access frames before simulation...");
			return false;
		}
		this.frameNumber = newFrameNumber;
		return this.frameNumber;
	}

	// EVENT HANDLERS
	onActiveElement(element: string, isDraggable: boolean) {
		this.activeElement = element;
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

	// HELPING FUNCTIONS
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

	isTherePhotons(y: number, x: number) {
		if (this.levelLoaded) {
			const particles = this.frames[this.frameNumber].quantum;
			return particles.filter((particle) => particle.coord.x === x && particle.coord.y === y);
		}
		return [];
	}

	isThereLasers(y: number, x: number) {
		if (this.levelLoaded) {
			return this.lasers.filter(
				(particle: any) => particle.coord.x === x && particle.coord.y === y
			);
		}
		return [];
	}

	// GETTERS
	get toolboxElements() {
		return this.level.grid.cells.filter((x) => !x.frozen);
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

  get probabilitySum(): number {
    let sum = 0;
    this.frames[this.frameNumber].quantum.forEach((particle) => {
      sum += particle.intensity;
    });
    return sum;
  }

  get activeFrame(): FrameInterface {
    return this.frames[this.frameNumber];
  }

	get lastFrame(): FrameInterface {
		return this.frames[this.frames.length - 1];
	}

	get computedGridStyle() {
		return {
			backgroundImage: `url(${gridSVG})`
		};
	}

	get gameState() {
		return this.activeFrame.gameState;
	}
}
</script>

<style lang="scss" scoped>
h1 {
	//color:crimson;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.title {
	margin-bottom: 30;
	margin-top: 0;
}

.game {
	width: 100%;
	min-height: 100vh;
}
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
.game {
	&.goals {
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
