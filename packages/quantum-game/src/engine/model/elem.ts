import { assertUnreachable, Vec2 } from '@/types'
import { Rotation, rotationToDegrees } from './rotation'

export enum Elem {
  // Basic
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

/**
 * Import element from unknown data type.
 * Expects and validates for a string equal to one of `Elem` variants.
 * @param name
 */
export function importElem(name: unknown): Elem | null {
  const elem = Elem[name as keyof typeof Elem]
  if (elem == null || typeof name !== 'string') {
    console.warn(`Invalid element type '${name}'`)
    return null
  }
  return elem
}

export function exportElem(elem: Elem): string {
  return Elem[elem]
}

export function elemName(elem: Elem): string {
  switch (elem) {
    case Elem.Wall:
      return 'Wall'
    case Elem.Gate:
      return 'Gate'
    case Elem.Laser:
      return 'Laser'
    case Elem.NonLinearCrystal:
      return 'Non-linear crystal'
    case Elem.Mirror:
      return 'Mirror'
    case Elem.BeamSplitter:
      return 'Beam splitter'
    case Elem.PolarizingBeamSplitter:
      return 'Polarizing beam splitter'
    case Elem.CoatedBeamSplitter:
      return 'Coated beam splitter'
    case Elem.CornerCube:
      return 'Corner cube'
    case Elem.Detector:
      return 'Detector'
    case Elem.Rock:
      return 'Rock'
    case Elem.Mine:
      return 'Mine'
    case Elem.Absorber:
      return 'Absorber'
    case Elem.DetectorFour:
      return 'Omnidirectional detector'
    case Elem.Polarizer:
      return 'Polarizer'
    case Elem.QuarterWavePlate:
      return 'Quarter-wave plate'
    case Elem.HalfWavePlate:
      return 'Half-wave plate'
    case Elem.SugarSolution:
      return 'Sugar solution'
    case Elem.FaradayRotator:
      return 'Faraday rotator'
    case Elem.Glass:
      return 'Glass'
    case Elem.VacuumJar:
      return 'Vacuum jar'
    default:
      assertUnreachable(elem)
  }
}

export type PieceWall = { type: Elem.Wall }
export type PieceGate = { type: Elem.Gate }
export type PieceLaser = { type: Elem.Laser; rotation: Rotation; polarization: number }
export type PieceNonLinearCrystal = { type: Elem.NonLinearCrystal }
export type PieceMirror = { type: Elem.Mirror; rotation: Rotation }
export type PieceBeamSplitter = { type: Elem.BeamSplitter; rotation: Rotation; split: number }
export type PiecePolarizingBeamSplitter = {
  type: Elem.PolarizingBeamSplitter
  rotation: Rotation
}
export type PieceCoatedBeamSplitter = {
  type: Elem.CoatedBeamSplitter
  rotation: Rotation
  split: number
}
export type PieceCornerCube = { type: Elem.CornerCube }
export type PieceDetector = { type: Elem.Detector; rotation: Rotation; goalThreshold: number }
export type PieceRock = { type: Elem.Rock }
export type PieceMine = { type: Elem.Mine }
export type PieceAbsorber = { type: Elem.Absorber; absorption: number }
export type PieceDetectorFour = { type: Elem.DetectorFour; goalThreshold: number }
export type PiecePolarizer = { type: Elem.Polarizer; rotation: Rotation }
export type PieceQuarterWavePlate = { type: Elem.QuarterWavePlate; rotation: Rotation }
export type PieceHalfWavePlate = { type: Elem.HalfWavePlate; rotation: Rotation }
export type PieceSugarSolution = {
  type: Elem.SugarSolution
  polarizationRotation: number
}
export type PieceFaradayRotator = {
  type: Elem.FaradayRotator
  rotation: Rotation
  polarizationRotation: number
}
export type PieceGlass = { type: Elem.Glass }
export type PieceVacuumJar = { type: Elem.VacuumJar }
export type PieceData =
  | PieceWall
  | PieceGate
  | PieceLaser
  | PieceNonLinearCrystal
  | PieceMirror
  | PieceBeamSplitter
  | PiecePolarizingBeamSplitter
  | PieceCoatedBeamSplitter
  | PieceCornerCube
  | PieceDetector
  | PieceRock
  | PieceMine
  | PieceAbsorber
  | PieceDetectorFour
  | PiecePolarizer
  | PieceQuarterWavePlate
  | PieceHalfWavePlate
  | PieceSugarSolution
  | PieceFaradayRotator
  | PieceGlass
  | PieceVacuumJar

/**
 * bit flags enum
 */
export const enum PieceFlags {
  Empty = 0,
  Draggable = 1 << 0,
  Rotateable = 1 << 1,
}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type Piece = Expand<
  Readonly<PieceData> & {
    readonly flags: PieceFlags
    readonly interactDelta: Vec2 | null
  }
>

export function defaultPiece(type: Elem): Piece {
  const common = {
    flags: PieceFlags.Empty,
    interactDelta: null,
  }

  switch (type) {
    case Elem.Wall:
    case Elem.Rock:
    case Elem.Gate:
    case Elem.Mine:
    case Elem.Glass:
    case Elem.VacuumJar:
    case Elem.CornerCube:
    case Elem.NonLinearCrystal:
      return { ...common, type }
    case Elem.Laser:
      return { ...common, type, rotation: Rotation.Right, polarization: 0 }
    case Elem.Mirror:
      return { ...common, type, rotation: Rotation.Right }
    case Elem.BeamSplitter:
      return { ...common, type, rotation: Rotation.Right, split: 0.5 }
    case Elem.PolarizingBeamSplitter:
      return { ...common, type, rotation: Rotation.Right }
    case Elem.CoatedBeamSplitter:
      return { ...common, type, rotation: Rotation.Right, split: 0.5 }
    case Elem.Detector:
      return { ...common, type, rotation: Rotation.Right, goalThreshold: 1 }
    case Elem.Absorber:
      return { ...common, type, absorption: 0.5 }
    case Elem.DetectorFour:
      return { ...common, type, goalThreshold: 1 }
    case Elem.Polarizer:
      return { ...common, type, rotation: Rotation.Right }
    case Elem.QuarterWavePlate:
      return { ...common, type, rotation: Rotation.Right }
    case Elem.HalfWavePlate:
      return { ...common, type, rotation: Rotation.Right }
    case Elem.SugarSolution:
      return { ...common, type, polarizationRotation: 0.125 }
    case Elem.FaradayRotator:
      return { ...common, type, rotation: Rotation.Right, polarizationRotation: 0.125 }
    default:
      assertUnreachable(type)
  }
}

export function pieceRotationDegrees(piece: Piece): number {
  if (!('rotation' in piece)) {
    return 0
  }
  switch (piece.type) {
    case Elem.Laser:
    case Elem.Detector:
    case Elem.FaradayRotator:
      return rotationToDegrees(piece.rotation)
    default:
      return rotationToDegrees(piece.rotation)
  }
}
