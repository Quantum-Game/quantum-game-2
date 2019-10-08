// TIME FRAME CLASS
// Allow time-travel debugging with step by step inc/dec of time
// Generate a new frame for every move of the particle
// Pointers are [coord, direction]

// Exit conditions
// - All goals done
// - Not enough intensity
// - No more particles

// TODO: Check that the required conditions are met for starting the sim (begin - end)
import { Cell } from "./Cell";
import { Goal } from "./Goal";
import Grid from "./Grid";
import Level from "./Level";
import { Pointer } from "./Pointer";

// Quantum
import Photons from "./numerics/Step";
import Game from "./Game";
// import Operator from "./numerics/Operator";
// import Dimension from "./numerics/Dimension";

export default class Frame {
	level: Level;
	game: Game;
	step: number;
	pointers: Pointer[];
	end: boolean;

	constructor(game: Game, level: Level, step = 0, pointers: Pointer[] = [], end = false) {
		this.step = step;
		this.level = level;
		this.pointers = pointers;
		this.end = end;
		// Initiate simulation with frame #0 and extract emitters
		if (step === 0) {
			this.activeLasers.forEach(laser => {
				if (laser.active) {
					// Classical code
					this.pointers.push(new Pointer(laser.coord, laser.rotation, 1, 0));

					// Quantum code
					const state = new Photons(this.grid.cols, this.grid.rows);
					state.addPhotonIndicator(laser.coord.y, laser.coord.x, laser.rotationAscii, "V");
					game.displayQuantum(state.vector.toString());
				}
			});

			// console.log("Propagated:");
			// state.propagatePhotons();
			// console.log(state.vector.toString());

			// console.log("Add:");
			// state.addPhotonIndicator(sizeX - 1, sizeY - 1, "^", "H");
			// console.log(state.vector.toString());

			// console.log("Propagated 2:");
			// state.propagatePhotons();
			// console.log(state.vector.toString());
		}
	}

	// Convenient getters
	get grid(): Grid {
		return this.level.grid;
	}
	get cells(): Cell[] {
		return this.level.grid.cells;
	}
	get lasers(): Cell[] {
		return this.level.grid.lasers;
	}
	get activeLasers(): Cell[] {
		return this.level.grid.activeLasers;
	}
	get goals(): Goal[] {
		return this.level.goals;
	}
	get completedGoals(): Goal[] {
		return this.level.goals.filter(goal => {
			return goal.completed;
		});
	}
	get victory(): boolean {
		return this.completedGoals.length === this.goals.length;
	}

	// nextQuantum(): Frame {
	// console.log("Propagated:")
	// state.propagatePhotons()
	// console.log(state.vector.toString())

	// console.log("Add:")
	// state.addPhotonIndicator(sizeX - 1, sizeY - 1, '^', 'H')
	// console.log(state.vector.toString())

	// console.log("Propagated 2:")
	// state.propagatePhotons()
	// console.log(state.vector.toString())
	// }

	// Compute the next frame by computing the next positions of different pointers
	next(): Frame {
		// Absorbers
		const detectors = this.grid.detectors;
		const rocks = this.grid.rocks;
		const mines = this.grid.mines;
		const filters = this.grid.absorbers;
		const absorbers: Cell[] = detectors.concat(rocks, mines, filters);
		// Reflectors
		const mirrors = this.grid.mirrors;
		const beamsplitters = this.grid.beamsplitters;
		// Phase shifters
		const phaseincs = this.grid.phaseincs;
		const phasedecs = this.grid.phasedecs;
		const phaseshifters: Cell[] = phaseincs.concat(phasedecs);

		// Loop through pointers
		this.pointers.forEach(pointer => {
			pointer.next();
			if (!this.grid.includes(pointer.coord)) {
				pointer.intensity = 0;
			}

			// Absorption
			absorbers.forEach((absorber: Cell) => {
				if (pointer.on(absorber)) {
					pointer.intensity *= absorber.element.absorption;
				}
			});

			// Reflection
			mirrors.forEach((mirror: Cell) => {
				if (pointer.on(mirror)) {
					pointer.direction = (2 * mirror.rotation - pointer.direction + 360) % 360;
				}
			});
			beamsplitters.forEach((beamsplitter: Cell) => {
				if (pointer.on(beamsplitter)) {
					// Dim the current pointer intensity
					pointer.intensity /= 2;
					// Reflecting pointer (create new reflected faded pointer)
					const direction = (2 * beamsplitter.rotation - pointer.direction + 360) % 360;
					this.pointers.push(new Pointer(pointer.coord, direction, pointer.intensity));
				}
			});

			// Phase shifters
			phaseshifters.forEach((phaseshifter: Cell) => {
				if (pointer.on(phaseshifter)) {
					pointer.phase = (pointer.phase + phaseshifter.element.phase) % 1;
				}
			});

			// Collision goals
			// FIXME: Make a shorthand for goals
			this.goals.forEach(goal => {
				if (goal.coord.equal(pointer.coord)) {
					goal.value += pointer.intensity * 100;
					pointer.intensity = 0;
				}
			});
		});

		// Erase null intensity pointers
		this.pointers = this.pointers.filter(pointer => {
			return pointer.intensity > 0;
		});

		// Victory conditions
		if (this.victory) {
			this.level.completed = true;
			this.end = true;
		}
		// Defeat conditions
		if (this.pointers.length === 0) {
			this.level.completed = false;
			this.end = true;
		}

		return new Frame(this.game, this.level, this.step + 1, this.pointers, this.end);
	}

	// Overriden method
	toString(): string {
		let result = `\n--- ${this.victory ? "VICTORY" : "IN PROGRESS"} --- Step #${this.step} with ${
			this.pointers.length
		} active pointers.\n`;
		result += "\n";
		result += Pointer.manyToString(this.pointers);
		result += "\n";
		result += Goal.manyToString(this.level.goals);
		return result;
	}
}
