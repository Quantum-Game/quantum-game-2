/**
 * PARTICLE INTERFACE
 * Particle interface in primitives
 */
export interface ParticleInterface {
  x: number;
  y: number;
  direction: number;
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
  tools: string[];
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
}

/**
 * GOAL INTERFACE
 * Goal interface in primitives
 */
export interface AbsorptionInterface {
  coord: CoordInterface;
  probability: number;
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
  frozen: boolean;
  rotation?: number;
  polarization?: number;
  percentage?: number;
  active?: boolean;
  energized?: boolean;
}

/**
 * ELEMENT TRANSITION INTERFACE
 * A transition interface composed of primitives to get operators
 */
export interface TransitionInterface {
  rotation: number;
  polarization: number;
  percentage: number;
}

/**
 * ELEMENT INTERFACE
 * Element interface composed of primitive types
 */
export interface ElementInterface {
  name: string;
  group: string;
  description: string;
  ascii: string[];
  params?: ElementParameterInterface[];
}

/**
 * ELEMENT PARAMETER INTERFACE
 * Element parameter interface composed of primitive types
 */
export interface ElementParameterInterface {
  key: string;
  value: number;
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
  grids?: GridInterface[];
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
  NonLinearCrystal = 'NonLinearCrystal',
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
  Polarizer = 'Polarizer',
  QuarterWavePlate = 'QuarterWavePlate',
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
  NonLinearCrystal = 'non-linear-crystal',
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
  Polarizer = 'polarizer',
  QuarterWavePlate = 'quarter-wave-plate',
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
  Basic: [Elem.Void],
  Source: [Elem.Laser, Elem.NonLinearCrystal],
  Direction: [
    Elem.Mirror,
    Elem.BeamSplitter,
    Elem.PolarizingBeamSplitter,
    Elem.CoatedBeamSplitter,
    Elem.CornerCube
  ],
  Absorption: [
    Elem.Gate,
    Elem.Detector,
    Elem.Rock,
    Elem.Mine,
    Elem.Absorber,
    Elem.DetectorFour,
    Elem.Wall
  ],
  Polarization: [Elem.Polarizer, Elem.QuarterWavePlate, Elem.SugarSolution, Elem.FaradayRotator],
  Phase: [Elem.Glass, Elem.VacuumJar]
};

/**
 * Photon indicator interface for glue code with qt Photons
 */
export interface IndicatorInterface {
  x: number;
  y: number;
  direction: DirEnum;
  polarization: PolEnum;
}

/**
 * Laser starting polarization enum
 */
export const enum PolEnum {
  V = 'V',
  H = 'H'
}

/**
 * Laser starting direction enum
 */
export const enum DirEnum {
  '>' = '>',
  '^' = '^',
  '<' = '<',
  'v' = 'v'
}

/**
 * Game state enum
 */
export const enum GameStateEnum {
  // Initial
  Initial = 'Initial',
  InProgress = 'InProgress',
  // Victory
  Victory = 'Victory',
  // Defeat
  MineExploded = 'MineExploded',
  GoalsNotCompleted = 'GoalsNotCompleted',
  ProbabilityTooLow = 'ProbabilityTooLow'
}
