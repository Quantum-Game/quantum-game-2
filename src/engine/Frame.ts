// TODO: Don't return whole level at each frame
// TODO: Frame could extend Level class
import * as qt from 'quantum-tensors';
import { FrameInterface, GameState } from './interfaces';
import { Coord, Cluster, Level, Goal, Particle } from './main';
import { Qparticle } from './Particle';

/**
 * TIME FRAME CLASS
 * Allow time-travel debugging with step by step inc/dec of time
 * Generate a new frame for every move of the particle
 * Particles are [coord, direction, CxA, CxB]
 */
export default class Frame {
	level: Level;
	step: number;
	classical: Particle[];
	quantum: Particle[];
	gameState: GameState;
	end: boolean;

	constructor(
		level: Level,
		step = 0,
		classical: Particle[] = [],
		quantum: Particle[] = [],
		gameState: GameState = GameState.Initial,
		end = false
	) {
		this.level = level;
		this.step = step;
		this.classical = classical;
		this.quantum = quantum;
		this.gameState = gameState;
		this.end = end;
	}

	/**
	 * Compute next classical and quantum frame
	 * @returns Frame
	 */
	next(): Frame {
		let classical: Particle[] = [];
		let quantum: Particle[] = [];
		const end = false;

		// Initialize photons from grid
		if (this.step === 0) {
			this.level.grid.lasers.active.cells.forEach((laser) => {
				// Classical code
				classical.push(laser.fire());
				// Quantum code
				this.level.state.addPhotonIndicator(laser.coord.x, laser.coord.y, laser.ascii, 'V');
				console.debug('quantum', this.level.state.vector.toString());
			});
			return new Frame(this.level, this.step + 1, classical, quantum, GameState.Initial, end);

			// Compute frames
		}
		quantum = this.nextQuantum();
		classical = this.nextClassical();
		// const gameState = this.processGameState()

		// Compute current gameState
		return new Frame(this.level, this.step + 1, classical, quantum, this.gameState, end);
	}

	/**
	 * Compute next quantum frame
	 * @returns Particle[]
	 */
	nextQuantum(): Particle[] {
		// Move
		this.level.state.propagatePhotons();
		// console.debug("quantum", this.level.state.vector.toString())

		// Process game state
		// FIXME: The propagate photon doesn't allow to check if photon was on tile
		this.updateGoals();
		this.gameState = this.processGameState();

		// Act
		const operations: [number, number, qt.Operator][] = this.level.grid.operatorList;
		this.level.state.actOnSinglePhotons(operations);
		// console.debug("OPERATIONS: " + operations)
		// console.debug(this.level.state.vector.toString())

		return this.level.state.aggregatePolarization().map((qParticle: Qparticle) => {
			const { x } = qParticle;
			const { y } = qParticle;
			const { direction } = qParticle;
			const { are } = qParticle;
			const { aim } = qParticle;
			const { bre } = qParticle;
			const { bim } = qParticle;
			const coord = new Coord(y, x);
			const particle = new Particle(coord, direction, 0, 0, are, aim, bre, bim);
			return particle;
		});
	}

	/**
	 * Compute next classical frame
	 * @returns Particle[]
	 */
	nextClassical(): Particle[] {
		return [];
	}

	/**
	 * String representing the state
	 * @returns string
	 */
	toString(): string {
		let result = `\n--- STEP ${this.step} ${this.gameState} --- `;
		result += `\nClassical (${this.classical.length} particles): `;
		result += Particle.manyToString(this.classical);
		result += `\nQuantum: (${this.quantum.length} particles)`;
		result += Particle.manyToString(this.quantum);
		result += '\n';
		result += `${this.level.goals.length} active goals...\n`;
		this.level.goals.forEach((goal) => {
			result += `- ${goal.toString()}\n`;
		});
		return result;
	}

	/**
	 * Export frame into primitives
	 * @returns FrameInterface
	 */
	exportFrame(): FrameInterface {
		return {
			level: this.level.exportLevel(),
			step: this.step,
			classical: this.classical.map((particle) => particle.exportParticle()),
			quantum: this.quantum.map((particle) => particle.exportParticle()),
			gameState: this.gameState,
			end: this.end
		};
	}

	/**
	 * Might be moves to the GameState class
	 * @returns GameState
	 */
	processGameState(): GameState {
		// Mines exploding
		if (this.explodingMines()) {
			return GameState.MineExploded;
		}
		// Victorious
		if (this.victory) {
			return GameState.Victory;
		}
		// Defeat or progress
		// Simulation running
		if (this.quantum.length > 0) {
			return GameState.InProgress;
		}
		// Unachieved goals
		if (this.quantum.length === 0) {
			return GameState.GoalsNotCompleted;
		}
		throw new Error('This frame does not return a GameState...');
	}

	/**
	 * Complete the goals with the photon probability
	 */
	updateGoals(): void {
		this.level.goals.forEach((goal) =>
			this.quantum.forEach((particle) => {
				if (particle.coord.equal(goal.coord)) {
					goal.value += particle.probability;
				}
			})
		);
	}

	/**
	 * Completed goals for frontend display
	 */
	get completedGoals(): Goal[] {
		return this.level.goals.filter((goal) => {
			return goal.completed;
		});
	}

	/**
	 * Are all the goals completed
	 */
	get victory(): boolean {
		return this.completedGoals.length === this.level.goals.length;
	}

	/**
	 * Retrieve the cells at the coordinate of particles
	 * @returns cells
	 */
	getParticleCells(particles: Particle[] = this.quantum): Cluster {
		return new Cluster(particles.map((particle) => this.level.grid.get(particle.coord)));
	}

	/**
	 * Are any mines exploding
	 * Filter the particle with more intensity than the mine threshold
	 * @returns boolean if there are exploding mines
	 */
	explodingMines(threshold = 0.01): boolean {
		const particles = this.quantum.filter((particle) => particle.probability > threshold);
		const explodingMines = this.getParticleCells(particles).mines.cells;
		if (explodingMines.length > 0) {
			console.info('Mine will explode...');
			console.info(explodingMines.map((mine) => mine.toString()));
			return true;
		}
		return false;
	}
}
