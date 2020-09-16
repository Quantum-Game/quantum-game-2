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
  rockTalkId?: string
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
 * CELL SIM INTERFACE (JSON format needs to be discussed)
 * A cell interface composed of primitives
 */
export interface ISimGrid {
  cols: number
  rows: number
  cells: ISimCell[]
}
export interface ISimCell {
  x: number
  y: number
  element: string
  frozen: boolean
  rotation: number
  polarization: number
  percentage: number
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
 * Laser starting polarization enum
 */
export const enum PolEnum {
  V = 'V',
  H = 'H',
}

/**
 * Laser starting direction enum
 */
export const enum DirEnum {
  '>' = '>',
  '^' = '^',
  '<' = '<',
  'v' = 'v',
}

/**
 * List of element names
 */
export enum Elem {
  // Basic
  Void,
  Wall,
  Gate,
  // Source
  Laser,
  NonLinearCrystal,
  // Direction
  Mirror,
  BeamSplitter,
  PolarizingBeamSplitter,
  CoatedBeamSplitter,
  CornerCube,
  // Absorption
  Detector,
  Rock,
  Mine,
  Absorber,
  DetectorFour,
  // Polarization
  Polarizer,
  QuarterWavePlate,
  HalfWavePlate,
  SugarSolution,
  FaradayRotator,
  // Phase
  Glass,
  VacuumJar,
}

export function elemFromString(name: string): Elem | undefined {
  return Elem[name as keyof typeof Elem]
}

/**
 * List of group names
 */
export const enum Group {
  Basic,
  Source,
  Direction,
  Absorption,
  Polarization,
  Phase,
}

/**
 * Element groups
 */
export const ElemGroups: Record<Group, Elem[]> = {
  [Group.Basic]: [Elem.Void],
  [Group.Source]: [Elem.Laser, Elem.NonLinearCrystal],
  [Group.Direction]: [
    Elem.Mirror,
    Elem.BeamSplitter,
    Elem.PolarizingBeamSplitter,
    Elem.CoatedBeamSplitter,
    Elem.CornerCube,
  ],
  [Group.Absorption]: [
    Elem.Gate,
    Elem.Detector,
    Elem.Rock,
    Elem.Mine,
    Elem.Absorber,
    Elem.DetectorFour,
    Elem.Wall,
  ],
  [Group.Polarization]: [
    Elem.Polarizer,
    Elem.QuarterWavePlate,
    Elem.HalfWavePlate,
    Elem.SugarSolution,
    Elem.FaradayRotator,
  ],
  [Group.Phase]: [Elem.Glass, Elem.VacuumJar],
}

/**
 * Game state enum
 */
export const enum GameStateEnum {
  InProgress,
  Victory,
  // Defeat
  MineExploded,
  GoalsNotCompleted,
  ProbabilityTooLow,
}
