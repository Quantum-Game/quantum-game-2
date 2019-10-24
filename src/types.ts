export interface RootState {
	currentLevel: {
		number?: number;
		boardDimensions: {
			x?: number;
			y?: number;
		};
		cells: { x: number; y: number; element: string; rotation: number; frozen: boolean }[];
		availableTools: Array<[string, number]>;
	};
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

export interface ICoord {
	x: number;
	y: number;
}

export interface IPhotonState {
	coord: ICoord;
	direction: number;
	intensity: number;
	phase: number;
}

export interface ParticleInterface {
	coord: ICoord;
	direction: number;
	intensity: number;
	phase: number;
	a: Complex;
	b: Complex;
}

export interface Qparticle {
	x: number;
	y: number;
	direction: number;
	are: number;
	aim: number;
	bre: number;
	bim: number;
}

export interface Frame {
	level: ILevel;
	step: number;
	particles: ParticleInterface[];
	quantum: ParticleInterface[];
	end: boolean;
	gameState: string;
	next: () => Frame;
}

export interface ICell {
	coord: ICoord;
	element: string;
	rotation: number;
	frozen: boolean;
	active?: boolean;
	energized?: boolean;
	originX?: number;
	originY?: number;
}

export interface IGrid {
	cols: number;
	rows: number;
	cells: Array<ICell>;
}

export interface ILevel {
	grid: IGrid;
}

export interface ILevelList {
	[index: string]: ILevel;
}

export interface IGameState {
	achievedGoals: boolean;
	noPointers: boolean;
	notEnoughIntensity: boolean;
}

export interface IFrame {
	step: number;
}

export interface IGoals {
	coord: ICoord;
	threshold: number;
	value: number;
}

export interface IHints {
	coord: ICoord;
	text: string;
}

export interface IToolset {
	[key: string]: any;
}

/**
 * Complex number class
 * https://en.wikipedia.org/wiki/Complex_number
 */
interface Complex {
	re: number;
	im: number;
	/**
	 * Creates a complex number
	 *
	 * @param re - The first input number
	 * @param im - The second input number
	 * @returns Creates a complex number `z = z.re + i z.im `
	 */
	constructor(re: number, im?: number): void;
	/**
	 * Radius in polar coordinate
	 * @returns number
	 */
	readonly r: number;
	/**
	 * Phi angle in polar coordinate
	 * @returns angle
	 */
	readonly phi: number;
	/**
	 * Phi angle in polar coordinate with TAU
	 * @returns angle divided by TAU
	 */
	readonly phiTau: number;
	/**
	 * Length squared: intensity probability
	 * @returns number
	 */
	abs2(): number;
	/**
	 * Absolute value (length)
	 * @returns absolute value
	 */
	abs(): number;
	/**
	 * Complex number argument in range [0,Tau]
	 * @returns number
	 */
	arg(): number;
	/**
	 * Addition
	 * @param z2 complex number to be added
	 * @returns z = z1 + z2
	 */
	add(z2: Complex): Complex;
	/**
	 * Substraction
	 * @param z2 complex number to be added
	 * @returns z = z1 - z2
	 */
	sub(z2: Complex): Complex;
	/**
	 * Multiplication
	 * @param z2 complex number to be multiplied
	 * @returns z = z1 * z2
	 */
	mul(z2: Complex): Complex;
	/**
	 * Complex conjugation
	 * @returns z = z{re, -im}
	 */
	conj(): Complex;
	/**
	 * Normalize
	 * https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/vector-magnitude-normalization
	 * @returns z
	 */
	normalize(): Complex;
	/**
	 * Tests if a complex is equal to another
	 * @param z2 complex to test equality
	 * @returns z1 === z2
	 */
	equal(z2: Complex): boolean;
	/**
	 * Check if a complex number is zero
	 * @return z1 === 0
	 */
	isZero(): boolean;
	/**
	 * Override toString() method
	 * @param complexFormat choice between ["cartesian", "polar", "polarTau"]
	 * @param precision float display precision
	 * @returns string with appropriate format
	 */
	toString(complexFormat?: string, precision?: number): string;
	/**
	 * Create a complex number from polar coordinates
	 * @param r Radius in polar coordinates
	 * @param phi Angle in polar coordinates
	 */
	fromPolar(r: number, phi: number): Complex;
}
/**
 * Syntactic sugar for `new Complex(re, im)`
 *
 * @param re - The first input number
 * @param im - The second input number
 * @returns Creates a complex number `z = z.re + i * z.im `
 */
// export default function Cx(re: number, im?: number): Complex;
export declare function Cx(re: number, im?: number): Complex;
