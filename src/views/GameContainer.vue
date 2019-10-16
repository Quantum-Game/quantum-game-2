<template>
	<div class="game">
		<main-layout>
			<section slot="main" class="center">
				<h1 v-if="error" class="error">{{ error }}</h1>
				<h1 v-else class="title">{{ level.name.toUpperCase() }}</h1>
				<!-- <board @setActiveElement="onActiveElement" /> -->
				<grid />
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
// import { Game } from 'quantumweasel';
// @ts-ignore
import levelData from '../game/levels';
import MainLayout from '../layouts/MainLayout.vue';
import Grid from '../components/Grid.vue';
// import { Board, Toolbox } from '../components';
// import { Photons } from 'quantum-tensors';
// import { IPhotonState, IGameState, IFrame, ICell, ILevel } from '@/types';
// import Game from '../game/Game';

@Component({
	components: {
		MainLayout,
		Grid
		// Board,
		// Toolbox
	}
})
export default class GameContainer extends Vue {
	level = {};
	error: string = '';
	game = {};
	activeElement = '';

	created() {
		this.loadALevel();
		console.log(this.level);

	}
	loadALevel() {
		this.error = '';
		// See if there's such level:
		const levelToLoad = levelData[this.currentLevelName];
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
