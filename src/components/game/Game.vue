<template>
	<div class="game-wrapper">
		haha

		</div>

</template>

<script lang="ts">

import Coord from "./Coord";
import Element from "./Element";
import Cell from "./Cell";
import Grid from "./Grid";
// import Level from "./Level";
import GameState from "./GameState";
import InputUtility from "./InputUtility";
// import Player from "./Player";
import Frame from "./Frame";
import { Actor, ActorType } from "./Actor";
import Pointer, { PathPointer } from "./Pointer";

// The stuff used:
import { Vue, Component, Watch } from 'vue-property-decorator';
import Level from '@/views/Level';

@Component
export default class Game extends Vue {

	private gameState = {
		achievedGoals: false,
		noPointers: false,
		notEnoughIntensity: false,
	}

	private frames = [];

	get isGameOver() {
		const { achievedGoals, noPointers, notEnoughIntensity } = this.gameState;
		return achievedGoals || noPointers || notEnoughIntensity;
	}

	created() {
		this.frames.push(new Frame(this, level));
		// Game mechanics
		this.gameState = new GameState();
		this.level = level;
		this.grid = this.level.grid;

		this.initializeGame();
		// this.mainLoop();
	}

	// private gameSize: { width: number; height: number };
	// private mapSize: { width: number; height: number };
	// private gameState: GameState;
	// tilesize = 32;
	// private turns = 0;
	// private player: Player;
	// public level: Level;
	// public grid: Grid;
	// public frames: Frame[];
	// public laserPaths: PathPointer[];

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		// document.getElementById("grid")!.appendChild(this.display.getContainer()!);


	// Getters and setters
	// get playerCell(): Cell {
	// 	return this.player.cell;
	// }
	// get playerCoord(): Coord {
	// 	return this.player.coord;
	// }

	// draw(cell: Cell, foregroundColor = "white", backgroundColor = "#2e006a"): void {
		// if (cell.frozen) {
		// 	backgroundColor = "turquoise";
		// }
		// if (cell.energized) {
		// 	backgroundColor = "red";
		// }
		// // Charlist array
		// const charList: string[] = [cell.ascii];
		// if (this.player.coord.equal(cell.coord)) {
		// 	charList.push("@");
		// }
		// this.display.draw(cell.coord.x, cell.coord.y, charList, foregroundColor, backgroundColor);
	// }

	// Init game
	private initializeGame(): void {
		// this.display.clear();
		if (!this.gameState.isGameOver() || this.gameState.doRestartGame()) {
			console.log("Starting game...");
		} else {
			alert("Victory!");
		}
		this.gameState.reset();

		this.drawPanel();
	}

	// Display relevant informations in html
	displayPlayer(): void {
		// document.getElementById("player")!.textContent = `Turns: ${this.turns} player: ${this.playerCoord.toString()}`;
	}
	displayQuantum(text: string): void {
		document.getElementById("quantum")!.textContent = text;
	}
	// displayCell(cell: Cell = this.player.cell): void {
	// 	document.getElementById("cell")!.textContent = cell.toString();
	// }
	displayLaser(laserPaths: PathPointer[] = this.laserPaths): void {
		document.getElementById("laser")!.innerHTML = Pointer.toString(laserPaths);
	}
	displayDebug(): void {
		// this.displayCell();
		this.displayPlayer();
		// this.displayLaser();
	}

	private drawPanel(): void {
		// this.display.clear();
		this.laserPaths = this.grid.laserCoords;
		this.grid.energizeCells(this.laserPaths);
		this.grid.activateCells();
		this.laserPaths = this.grid.laserCoords;
		this.displayDebug();
		this.drawGrid();
	}

	// Draw
	public drawGrid(): void {
		console.log(`Rendering WebGL game grid...`);
		for (let y = 0; y < this.grid.rows; y++) {
			for (let x = 0; x < this.grid.cols; x++) {
				const coord = Coord.importJSON({ y: y, x: x });
				const cell = this.grid.get(coord);

				//  Find the laserPath object on a specific cell
				const sum = this.coordIntensitySum(coord);
				if (sum > 0) {
					// const hsl = Color.hsl2rgb([0.45, sum, 0.5]);
					// const rgb = Color.toHex(hsl);
					// console.log(`Laser intensity: ${sum} - HSL: ${hsl} - RGB: ${rgb}`);
					// this.draw(cell, "white", rgb);
				} else {
					this.draw(cell);
				}
			}
		}
	}

	// Pointers on a specific coord
	coordIntensitySum(coord: Coord): number {
		let sum = 0;
		const pointers = this.laserPaths.filter(pathPointer => {
			return coord.equal(pathPointer.coord);
		});
		pointers.forEach(pointer => {
			sum += pointer.intensity;
		});
		return sum;
	}

	// private handleInput(event: KeyboardEvent): boolean {
	// 	const code = event.keyCode;
	// 	// return code === KEYS.VK_SPACE || code === KEYS.VK_RETURN;
	// }
}
</script>

<style lang="scss">
.game-wrapper {
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.85);
}
</style>