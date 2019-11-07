/**
 * ROOT STATE INTERFACE
 * Holds global state of the application
 * FIXME: See where the root state should be
 */
// export interface RootState {
//   activeCell: CellInterface;
//   currentTools: CellInterface[];
//   isMoving: boolean;
//   moveSource: string;
// }

/**
 * PARTICLE INTERFACE
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
 * DETECTION INTERFACE
 */
export interface detectionInterface {
  coord: CoordInterface;
  probability: number;
}

/**
 * LEVEL LIST INTERFACE
 * level dictionary interface
 */
export interface LevelListInterface {
  [index: string]: LevelInterface;
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
 * CLASSICAL LEVEL INTERFACE
 * original level structure for importing V1 levels
 */
export interface ClassicLevelInterface {
  name: string;
  group: string;
  width: number;
  height: number;
  tiles: {
    i: number;
    j: number;
    name: string;
    rotation: number;
    frozen: boolean;
  }[];
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
  content: string;
  color?: string;
  rotation?: number;
  active?: boolean;
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
  rotation?: number;
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
 * ENCYCLOPEDIA ENTRY LIST INTERFACE
 * Encyclopedia entry list in primitives
 */
export interface EntryListInterface {
  [index: string]: EntryInterface;
}

/**
 * ENCYCLOPEDIA ENTRY INTERFACE
 * Encyclopedia entry interface in primitives
 */
export interface EntryInterface {
  title: string;
  elementName: string;
  short?: string;
  grids: GridInterface[];
  sections: EntrySectionInterface[];
}

/**
 * ENCYCLOPEDIA ENTRY SECTION INTERFACE
 * Encyclopedia entry section interface
 */
export interface EntrySectionInterface {
  title: string;
  content?: string;
  pics?: string[];
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
 * List of element names in url compatible format
 */
export const enum ElemLower {
  // Basic
  Void = 'void',
  Wall = 'wall',
  Gate = 'gate',
  // Source
  Laser = 'laser',
  // Direction
  Mirror = 'mirror',
  BeamSplitter = 'beam-splitter',
  PolarizingBeamSplitter = 'polarizing-beam-splitter',
  CoatedBeamSplitter = 'coated-beam-splitter',
  CornerCube = 'corner-cube',
  // Absorption
  Detector = 'detector',
  Rock = 'rock',
  Mine = 'mine',
  Absorber = 'absorber',
  DetectorFour = 'detector-four',
  // Polarization
  PolarizerH = 'polarizer-h',
  PolarizerV = 'polarizer-v',
  QuarterWavePlateH = 'quarter-wave-plate-h',
  QuarterWavePlateV = 'quarter-wave-plate-v',
  SugarSolution = 'sugar-solution',
  FaradayRotator = 'faraday-rotator',
  // Phase
  Glass = 'glass',
  VacuumJar = 'vacuum-jar'
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
