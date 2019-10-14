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

export interface ICoord {
	x: number;
	y: number;
}

// "PathPointer"
export interface IPhotonState {
	coord: ICoord;
	direction: number;
	intensity: number;
	phase: number;
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

export interface ILevel {
	id: number;
	name: string;
	group: string;
	description: string;
	cols: number;
	rows: number;
	cells: ICell[];
	goals: IGoals[];
	hints: IHints[];
}

export interface IToolset {
	[key: string]: any;
}
