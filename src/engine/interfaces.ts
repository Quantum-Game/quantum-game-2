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
export const ElemGroups: { [symbol: string]: Elem[] } = {
	Basic: [Elem.Void, Elem.Wall, Elem.Gate],
	Source: [Elem.Laser],
	Direction: [
		Elem.Mirror,
		Elem.BeamSplitter,
		Elem.PolarizingBeamSplitter,
		Elem.CoatedBeamSplitter,
		Elem.CornerCube
	],
	Absorption: [Elem.Detector, Elem.Rock, Elem.Mine, Elem.Absorber, Elem.DetectorFour],
	Polarization: [
		Elem.PolarizerH,
		Elem.PolarizerV,
		Elem.QuarterWavePlateH,
		Elem.QuarterWavePlateV,
		Elem.SugarSolution,
		Elem.FaradayRotator
	],
	Phase: [Elem.Glass, Elem.VacuumJar]
};

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
