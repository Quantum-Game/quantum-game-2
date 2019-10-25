import { ParticleInterface } from './quantumweasel.d';

declare module 'quantumweasel' {
	/**
	 * FRAME INTERFACE
	 * time-frame in primitives
	 */
	export interface FrameInterface {
		level: LevelInterface;
		step: number;
		classical: ParticleInterface[];
		quantum: ParticleInterface[];
		gameState: GameState;
		end: boolean;
	}

	/**
	 * Particle interface in primitives
	 */
	export interface ParticleInterface {
		coord: CoordInterface;
		direction: number;
		intensity: number;
		phase: number;
		are: number;
		aim: number;
		bre: number;
		bim: number;
	}

	/**
	 * LEVEL INTERFACE
	 * level interface in primitives
	 */
	export interface LevelInterface {
		id: number;
		name: string;
		group: string;
		description: string;
		grid: GridInterface;
		goals: GoalInterface[];
		hints: HintInterface[];
	}

	/**
	 * GOAL INTERFACE
	 * Goal interface in primitives
	 */
	export interface GoalInterface {
		coord: CoordInterface;
		threshold: number;
		value: number;
	}

	/**
	 * HINT INTERFACE
	 * Hint interface in primitives
	 */
	export interface HintInterface {
		coord: CoordInterface;
		text: string;
	}
	/**
	 * GRID INTERFACE
	 * Grid interface in primitives
	 */
	export interface GridInterface {
		cols: number;
		rows: number;
		cells: CellInterface[];
	}

	/**
	 * CLUSTER INTERFACE
	 * Cluster of cells in primitives
	 */
	export interface ClusterInterface {
		cells: CellInterface[];
	}

	/**
	 * CELL INTERFACE
	 * A cell interface composed of primitives
	 */
	export interface CellInterface {
		coord: CoordInterface;
		element: string;
		rotation: number;
		frozen: boolean;
		active?: boolean;
		energized?: boolean;
	}

	/**
	 * ELEMENT INTERFACE
	 * Element interface composed of primitive types
	 */
	export interface ElementInterface {
		id: number;
		name: string;
		group: string;
		description: string;
		active: boolean;
		absorption: number;
		phase: number;
		ascii: string[];
		tiles: number[][];
	}

	/**
	 * COORDINATE INTERFACE
	 * A coordinates interface of primitives
	 */
	export interface CoordInterface {
		x: number;
		y: number;
	}

	/**
	 * CLASSES
	 */
	class Coord {
		x: number;
		y: number;

		up(): Coord;
		down(): Coord;
		left(): Coord;
		right(): Coord;
		adjacent(): Coord[];
		isAdjacent(coord: Coord): boolean;
		fromAngle(directionAngle: number): Coord;

		equal(coord: Coord): boolean;
		isIncludedIn(coords: Coord[]): boolean;

		uid(rows: number): number;
		static fromId(index: number, cols: number): Coord;
		pos(cellSize: number): CoordInterface;
		center(cellSize: number): CoordInterface;

		toArray(): [number, number];
		toString(): string;
		exportCoord(): CoordInterface;
		static importCoord(obj: CoordInterface): Coord;
	}

	class Cell {
		coord: Coord;
		element: Element;
		rotation: number;
		frozen: boolean;
		active: boolean;
		energized: boolean;

		ascii(): string;
		isVoid(): boolean;
		rotationAscii(): string;
		rotate(angle?: number): void;
		toggleFreeze(): void;
		toggleActive(): void;
		toggleEnergized(): void;
		fire(): Particle;

		toString(): string;
		static importCell(cell: CellInterface): Cell;
		exportCell(): CellInterface;
	}

	class Cluster {
		cells: Cell[];

		coords(): Coord[];
		elements(): Element[];
		origin(): Coord;
		compress(): Cluster;

		filteredBy(name: string): Cluster;
		filteredByNot(name: string): Cluster;
		unvoid(): Cluster;
		active(): Cluster;
		inactive(): Cluster;
		energized(): Cluster;
		unenergized(): Cluster;
		frozen(): Cluster;
		unfrozen(): Cluster;

		lasers(): Cluster;

		mirrors(): Cluster;
		beamsplitters(): Cluster;
		coatedbeamsplitters(): Cluster;
		polarbeamsplitters(): Cluster;
		cornercubes(): Cluster;
		reflectors(): Cluster;

		detectors(): Cluster;
		mines(): Cluster;
		rocks(): Cluster;
		fourdetectors(): Cluster;
		filters(): Cluster;
		walls(): Cluster;
		gates(): Cluster;
		closedGates(): Cluster;
		openedGates(): Cluster;
		absorbers(): Cluster;

		polarizersH(): Cluster;
		polarizersV(): Cluster;
		waveplatesH(): Cluster;
		waveplatesV(): Cluster;
		sugars(): Cluster;
		faradays(): Cluster;
		polarizers(): Cluster;

		vacuumjars(): Cluster;
		glasses(): Cluster;
		phaseshifters(): Cluster;

		toString(): string;
		exportCluster(): ClusterInterface;
		static importCluster(cells: CellInterface[]): Cluster;
	}

	class Grid extends Cluster {
		rows: number;
		cols: number;
		paths: Particle[];
		cells: Cell[];

		set(cell: Cell): boolean;
		get(coord: Coord): Cell;
		center(): Coord;
		operatorList(): [number, number, any][];
		includes(coord: Coord): boolean;
		move(src: Coord, dst: Coord): boolean;
		moveAll(directionAngle: number): void;
		fireLasers(): Particle[];
		coordIntensitySum(coord: Coord): number;
		laserPath(particle: Particle, maxFrames?: number): Particle[][];
		computePaths(): ParticleInterface[];
		energizeCells(paths: ParticleInterface[]): void;
		activateCells(): void;
		adjacentCells(coord: Coord): Cell[];
		// Should be static?
		ascii(): string;
		exportGrid(): GridInterface;
		importGrid(cells: CellInterface[]): void;
	}

	class Level {
		id: number;
		name: string;
		group: string;
		description: string;
		grid: Grid;
		goals: Goal[];
		hints: Hint[];
		completed: boolean;

		toString(): string;
		exportLevel(): LevelInterface;
		static importLevel(level: LevelInterface): Level;
	}

	class Particle {
		coord: Coord;
		direction: number;
		intensity: number;
		phase: number;
		// TODO: Declared as complex see this more
		a: any;
		b: any;
		path: ParticleInterface[];

		origin(): Coord;
		alive(): boolean;
		are(): number;
		aim(): number;
		bre(): number;
		bim(): number;
		clone(): Particle;
		isVertical(): boolean;
		opacity(): number;
		setIntensity(): void;
		pathParticle(): Particle;
		on(cell: Cell): boolean;
		stepsToExit(cols: number, rows: number): number;
		next(): Particle;
		toString(): string;
		static manyToString(particles: Particle[]): string;
		exportParticle(): ParticleInterface;
		static importParticle(obj: ParticleInterface): Particle;
	}

	class Frame {
		level: Level;
		step: number;
		classical: Particle[];
		quantum: Particle[];
		gameState: GameState;
		end: boolean;

		next(): Frame;
		nextQuantum(): Particle[];
		nextClassical(): Particle[];
		toString(): string;
		exportFrame(): FrameInterface;
		processGameState(): GameState;
		updateGoals(): void;
		completedGoals(): Goal[];
		victory(): boolean;
		getParticleCells(particles?: Particle[]): Cluster;
		explodingMines(threshold?: number): boolean;
	}

	class Goal {
		coord: Coord;
		threshold: number;
		value: number;
	}

	class Hint {}

	/**
	 * List of element names
	 */
	export const enum Elem {
		// Basic
		Void = 'Void',
		Wall = 'Wall',
		Gate = 'Gate',
		// Source
		Laser = 'Laser',
		// Direction
		Mirror = 'Mirror',
		BeamSplitter = 'BeamSplitter',
		PolarizingBeamSplitter = 'PolarizingBeamSplitter',
		CoatedBeamSplitter = 'CoatedBeamSplitter',
		CornerCube = 'CornerCube',
		// Absorption
		Detector = 'Detector',
		Rock = 'Rock',
		Mine = 'Mine',
		Absorber = 'Absorber',
		DetectorFour = 'DetectorFour',
		// Polarization
		PolarizerH = 'PolarizerH',
		PolarizerV = 'PolarizerV',
		QuarterWavePlateH = 'QuarterWavePlateH',
		QuarterWavePlateV = 'QuarterWavePlateV',
		SugarSolution = 'SugarSolution',
		FaradayRotator = 'FaradayRotator',
		// Phase
		Glass = 'Glass',
		VacuumJar = 'VacuumJar'
	}

	/**
	 * List of group names
	 */
	export const enum Group {
		Basic = 'Basic',
		Source = 'Source',
		Direction = 'Direction',
		Absorption = 'Absorption',
		Polarization = 'Polarization',
		Phase = 'Phase'
	}

	/**
	 * Element groups
	 */
	export const ElemGroups: { [symbol: string]: Elem[] };

	/**
	 * Game state enum
	 */
	export const enum GameState {
		// Initial
		Initial = 'Initial',
		InProgress = 'InProgress',
		// Victory
		Victory = 'Victory',
		// Defeat
		MineExploded = 'MineExploded',
		GoalsNotCompleted = 'GoalsNotCompleted',
		ProbabilityTooLow = 'ProbabilityTooLow',
		InfiniteLoop = 'InfiniteLoop'
	}
}
// declare module 'vue-css-donut-chart'
