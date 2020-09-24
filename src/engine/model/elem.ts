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
