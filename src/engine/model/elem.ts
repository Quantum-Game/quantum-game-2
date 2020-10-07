import { assertUnreachable } from '@/types'

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
