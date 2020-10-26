import {
  Simulation as QTSimulation,
  Frame as QTFrame,
  Vector,
  Complex,
  Operator,
  interfaces,
  Dimension,
  Elements,
  Ops,
} from 'quantum-tensors'
import { Board } from './level'
import { Elem, Piece, PieceLaser } from './elem'
import { Coord } from './coord'
import { Direction, directionFromDegrees } from './direction'
import { Rotation, rotationToDegrees } from './rotation'
import { groupReduceBy, iFilter, iMap } from '@/itertools'
import { assertUnreachable } from '@/types'
import { TAU } from '../Helpers'

// reexport types from quantum-tensors that we actually
// intend to use in other parts of the app
export { Complex, Vector }

/**
 * Simulation data derived from quantum-tensors simulation
 * boiled down to the necessary data required by the game
 */
export interface Simulation {
  readonly frames: Frame[]
  readonly upToFrameAbsorptions: Map<Coord, number>[]
}

export interface Frame {
  readonly particles: Particle[]
  readonly vector: Vector
  readonly absorptions: Map<Coord, number>
}

export interface Particle {
  readonly coord: Coord
  readonly direction: Direction
  readonly a: Complex
  readonly b: Complex
}

export function particleProbability(p: Particle): number {
  return Math.max(0, Math.min(1, p.a.abs2() + p.b.abs2()))
}

function importFrame(frame: QTFrame): Frame {
  return {
    particles: frame.particles.map(importParticle),
    vector: frame.vector,
    absorptions: groupReduceBy(
      frame.absorptions,
      (absorption) => Coord.new(absorption.x, absorption.y),
      () => 0,
      (sum, absorption) => sum + absorption.probability
    ),
  }
}

function importParticle(particle: interfaces.IParticle): Particle {
  return {
    coord: Coord.new(particle.x, particle.y),
    direction: directionFromDegrees(particle.direction),
    a: new Complex(particle.are, particle.aim),
    b: new Complex(particle.bre, particle.bim),
  }
}

function importAbsorptions(frames: Frame[]): Map<Coord, number>[] {
  let cumulative = new Map<Coord, number>()
  return frames.map((frame) => {
    cumulative = groupReduceBy(
      frame.absorptions,
      (entry) => entry[0],
      () => 0,
      (sum, entry) => sum + entry[1],
      new Map(cumulative)
    )
    return cumulative
  })
}

function importSimulation(sim: QTSimulation): Simulation {
  const frames = sim.frames.map(importFrame)
  return {
    frames,
    upToFrameAbsorptions: importAbsorptions(frames),
  }
}

/**
 * Compute local operator for given cell
 */
export function cellOperator(cell: Piece): Operator {
  switch (cell.type) {
    case Elem.Detector:
    case Elem.DetectorFour:
    case Elem.Gate:
    case Elem.Laser:
    case Elem.Mine:
    case Elem.Rock:
    case Elem.Wall:
      return Elements.attenuator(0)
    case Elem.Absorber:
      return Elements.attenuator(Math.sqrt(cell.absorption))
    case Elem.BeamSplitter:
      return beamSplitter(rotationToDegrees(cell.rotation), cell.split)
    case Elem.CoatedBeamSplitter:
      return beamSplitter(rotationToDegrees(cell.rotation), cell.split)
    case Elem.CornerCube:
      return Elements.cornerCube()
    case Elem.FaradayRotator:
      return Elements.faradayRotator(rotationToDegrees(cell.rotation))
    case Elem.Mirror:
      return Elements.mirror(rotationToDegrees(cell.rotation))
    case Elem.NonLinearCrystal:
      return Elements.attenuator(1)
    case Elem.Polarizer:
      return Elements.polarizer(rotationToDegrees(cell.rotation))
    case Elem.PolarizingBeamSplitter:
      return Elements.polarizingBeamsplitter(rotationToDegrees(cell.rotation))
    case Elem.HalfWavePlate:
      return Elements.phasePlate(rotationToDegrees(cell.rotation), 0.5)
    case Elem.QuarterWavePlate:
      return Elements.phasePlate(rotationToDegrees(cell.rotation), 0.25)
    case Elem.SugarSolution:
      return Elements.sugarSolution(cell.polarizationRotation)
    case Elem.Glass:
      return Elements.glassSlab()
    case Elem.VacuumJar:
      return Elements.vacuumJar()
    default:
      return assertUnreachable(cell)
  }
}

function generateOperators(board: Board) {
  return Array.from(
    iMap(board.pieces, ([coord, piece]) => ({
      x: coord.x,
      y: coord.y,
      op: cellOperator(piece),
    }))
  )
}

function laserDirection(rotation: Rotation) {
  switch (rotation) {
    case Rotation.Right:
      return '>'
    case Rotation.Up:
      return '^'
    case Rotation.Left:
      return '<'
    case Rotation.Down:
      return 'v'
    default:
      return '>'
  }
}

const dimPol = Dimension.polarization()
const polIndicator = Vector.indicator([dimPol], ['H'])

function generateLaserState(board: Board): Vector | null {
  const lasers = Array.from(
    iFilter(
      board.pieces,
      (entry): entry is [Coord, Piece & PieceLaser] => entry[1].type === Elem.Laser
    )
  )

  const dimPosDir = [
    Dimension.position(board.width, 'x'),
    Dimension.position(board.height, 'y'),
    Dimension.direction(),
  ]

  let vec = null
  for (const [coord, laser] of lasers) {
    const dir = laserDirection(laser.rotation)
    const polVec = Ops.rotationMatrix(laser.polarization * TAU, dimPol).mulVec(polIndicator)
    const localVec = Vector.indicator(dimPosDir, [`${coord.x}`, `${coord.y}`, dir]).outer(polVec)
    vec = vec == null ? localVec : vec.outer(localVec)
  }
  return vec
}

export function runSimulation(board: Board, maxFrames: number, initialState?: Vector): Simulation {
  const state = initialState
    ? initialState.toBasisAll('polarization', 'HV')
    : generateLaserState(board)

  if (state == null) {
    return {
      frames: [],
      upToFrameAbsorptions: [],
    }
  }

  const simulation = new QTSimulation(board.width, board.height, generateOperators(board))
  const frame = new QTFrame(simulation)
  frame.vector = state
  simulation.frames.push(frame)
  simulation.generateFrames(maxFrames)
  return importSimulation(simulation)
}

const idPol = Operator.identity([dimPol])
export function beamSplitter(angle: number, split: number): Operator {
  return Operator.outer([Ops.reflectFromPlaneDirection(angle), Ops.reflectPhaseFromDenser()])
    .mulConstant(new Complex(0.0, Math.sqrt(split)))
    .add(
      Ops.beamsplitterTransmittionDirections(angle)
        .outer(idPol)
        .mulConstant(new Complex(Math.sqrt(1 - split), 0.0))
    )
}
