<template>
	<div class="game">
		<!-- <section class="left">
			<div :class="{ open: menuOpen, 'menu-icon': true }" @click="toggleIcon">
				<div class="bar1"></div>
				<div class="bar2"></div>
				<div class="bar3"></div>
			</div>
		</section>
		<section class="center">
			<h1 v-if="error" class="error">{{ error }}</h1>
			<h1 v-else class="title">{{ level.name.toUpperCase() }}</h1>
			<board :initial-board="initialBoard" @setActiveElement="onActiveElement" />
		</section>
		<section class="right">
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
// import { Game } from 'quantumweasel';
// import { Photons } from 'quantum-tensors';
import { IPhotonState, IGameState, IFrame, ICell, ILevel } from '@/types';
// import { Board, Toolbox } from '../components';
// import levels from '../levels';
// import Game from '../game/Game';

@Component({
	components: {
		// Board,
		// Toolbox
	}
})
export default class Container extends Vue {
	// original Game TS class functionality:
	// laserPath: Array<IPhotonState> = [];
	// gameState: IGameState = {
	// 	achievedGoals: false,
	// 	noPointers: false,
	// 	notEnoughIntensity: false
	// };
	// level = {
	// 	cols: 0,
	// 	rows: 0,
	// 	cells: []
	// };
	// frames: Array<IFrame> = [];
	// error: string = '';
	// menuOpen: boolean = false;
	// initialTools: Array<ICell> = [];
	// initialBoard: { cells: Array<ICell>; rows: number; cols: number } = {
	// 	cells: [],
	// 	rows: 0,
	// 	cols: 0
	// };
	// activeElement = '???';
	// actualGame = {};
	// created() {
	// 	this.loadALevel(this.levelNumber);
	// }
	// loadALevel(number: number) {
	// 	this.error = '';
	// 	// See if there's such level:
	// 	const rawLevel = levels[number];
	// 	if (!rawLevel) {
	// 		this.error = 'no such level!';
	// 		return false;
	// 	}
	// 	this.level = rawLevel.default;
	// 	this.actualGame = new Game(this.level, 32);
	// 	console.log(this.actualGame);
	// 	return true;
	// }
	// serveInitialItems() {
	// 	const { cells, rows, cols } = this.level;
	// 	this.initialTools = cells.filter((cell: ICell) => !cell.frozen);
	// 	this.initialBoard = { cells: cells.filter((cell: ICell) => cell.frozen), rows, cols };
	// }
	// get levelNumber() {
	// 	return parseInt(this.$route.params.id, 10);
	// }
	// @Watch('levelNumber')
	// updateLevelData(val: number) {
	// 	this.loadALevel(val);
	// }
	// toggleIcon() {
	// 	this.menuOpen = !this.menuOpen;
	// }
	// onActiveElement(element: string, isDraggable: boolean) {
	// 	this.activeElement = element;
}
</script>

<style lang="scss">
.game {
	height: 100%;
	display: flex;
	flex-direction: row;
	color: white;
	& section {
		padding: 20px;
		align-content: center;
		width: 60%;
		&.left,
		&.right {
			width: 20%;
		}
		&.right {
			padding-top: 10%;
		}
		&.center {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}
	}
}

// menu-icon stuff
.menu-icon {
	display: inline-block;
	cursor: pointer;

	.bar1,
	.bar2,
	.bar3 {
		width: 35px;
		height: 5px;
		background-color: rgb(255, 255, 255);
		margin: 6px 0;
		transition: 0.4s;
	}

	/* Rotate first bar */
	&.open .bar1 {
		transform: rotate(-45deg) translate(-9px, 6px);
		transform: rotate(-45deg) translate(-9px, 6px);
	}

	/* Fade out the second bar */
	&.open .bar2 {
		opacity: 0;
	}

	/* Rotate last bar */
	&.open .bar3 {
		transform: rotate(45deg) translate(-8px, -8px);
		transform: rotate(45deg) translate(-8px, -8px);
	}
}
</style>
