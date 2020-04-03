/**
 * USER STATE INTERFACE
 */
export interface IUserState {
  user: {
    loggedIn: boolean
    rememberMe: boolean
    data: {
      displayName: string
      email: string
    }
  }
  progressArr: IProgressObj[]
  savedLevelsList: ISavedLevel[]
  publicLevels: IPublicLevel[]
  fetchedLevel?: string
  error: null
}

interface IProgressObj {
  id: number
  status: 'string'
  score: number
}

interface ISavedLevel {
  id: 'string'
  link: 'string'
  public: boolean
}

interface IPublicLevel {
  link: 'string'
}

/**
 * PARTICLE INTERFACE
 * Particle interface in primitives
 */
export interface IParticle {
  x: number
  y: number
  direction: number
  are: number
  aim: number
  bre: number
  bim: number
}

// TODO: Should come as enum in a nicer format
export interface IParticleCoord {
  kind: string // for now only 'photon'
  x: number
  y: number
  dir: number // 0: > 1: ^, 2: <. 3: v
  pol: number // 0: H, 1: V
}

/**
 * DETECTION INTERFACE
 */
export interface IDetection {
  coord: ICoord
  probability: number
}

/**
 * LEVEL LIST INTERFACE
 * level dictionary interface
 */
export interface ILevelList {
  [index: string]: ILevel
}

/**
 * LEVEL INTERFACE
 * level interface in primitives
 */
export interface ILevel {
  id: number
  name: string
  group: string
  description: string
  grid: IGrid
  goals: IGoal[]
  hints: IHint[]
  tools: string[]
  safetyThreshold?: number
}

/**
 * GOAL INTERFACE
 * Goal interface in primitives
 */
export interface IGoal {
  coord: ICoord
  threshold: number
}

/**
 * GOAL INTERFACE
 * Goal interface in primitives
 */
export interface IAbsorption {
  coord: ICoord
  probability: number
}

/**
 * HINT INTERFACE
 * Hint interface in primitives
 */
export interface IHint {
  coord: ICoord
  content: string
  color?: string
  rotation?: number
  active?: boolean
}

/**
 * GRID INTERFACE
 * Grid interface in primitives
 */
export interface IGrid {
  cols: number
  rows: number
  cells: ICell[]
}

/**
 * CLUSTER INTERFACE
 * Cluster of cells in primitives
 */
export interface ICluster {
  cells: ICell[]
}

/**
 * CELL INTERFACE
 * A cell interface composed of primitives
 */
export interface ICell {
  coord: ICoord
  element: string
  frozen: boolean
  rotation?: number
  polarization?: number
  percentage?: number
  active?: boolean
  energized?: boolean
}

/**
 * ELEMENT TRANSITION INTERFACE
 * A transition interface composed of primitives to get operators
 */
export interface ITransition {
  rotation: number
  polarization: number
  percentage: number
}

/**
 * ELEMENT INTERFACE
 * Element interface composed of primitive types
 */
export interface IElement {
  name: string
  group: string
  description: string
  ascii: string[]
  params?: IElementParameter[]
}

/**
 * ELEMENT PARAMETER INTERFACE
 * Element parameter interface composed of primitive types
 */
export interface IElementParameter {
  key: string
  value: number
}

/**
 * COORDINATE INTERFACE
 * A coordinates interface of primitives
 */
export interface ICoord {
  x: number
  y: number
}

export interface IMatrixElement {
  i: number
  j: number
  re: number
  im: number
}

/**
 * ENCYCLOPEDIA ENTRY LIST INTERFACE
 * Encyclopedia entry list in primitives
 */
export interface IEntryList {
  [index: string]: IEntry
}

export interface IEntryNameList {
  name: string
  ready: boolean
}

/**
 * ENCYCLOPEDIA ENTRY INTERFACE
 * Encyclopedia entry interface in primitives
 */
export interface IEntry {
  title: string
  elementName: string
  short: string
  grids: IGrid[]
  sections: IEntrySection[]
}

/**
 * ENCYCLOPEDIA ENTRY SECTION INTERFACE
 * Encyclopedia entry section interface
 */
export interface IEntrySection {
  title: string
  content?: string
  pics?: string[]
}

/**
 * Photon indicator interface for glue code with qt Photons
 * @deprecated
 */
export interface IIndicator {
  x: number
  y: number
  direction: DirEnum
  polarization: PolEnum
}

/**
 * List of element names
 */
export enum Elem {
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
