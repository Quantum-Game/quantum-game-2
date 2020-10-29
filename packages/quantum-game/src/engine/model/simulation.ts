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
  Cx,
  VectorEntry,
} from 'quantum-tensors'
import { Board } from './level'
import { Elem, Piece, PieceLaser } from './elem'
import { Coord } from './coord'
import { Direction, directionFromDegrees } from './direction'
import { Rotation, rotationToDegrees } from './rotation'
import { groupReduceBy, iFilter, iMap } from '@/itertools'
import { assertUnreachable } from '@/types'
import { TAU } from '../Helpers'

import { Angle, Coord as RustCoord, Complex as RustComplex, SimulationBuilder } from 'qg-rust'
import { $flags } from '@/flags'

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
      return Elements.beamSplitter(rotationToDegrees(cell.rotation), cell.split)
    case Elem.CoatedBeamSplitter:
      return Elements.beamSplitter(rotationToDegrees(cell.rotation), cell.split)
    case Elem.CornerCube:
      return Elements.cornerCube()
    case Elem.FaradayRotator:
      return Elements.faradayRotator(rotationToDegrees(cell.rotation), cell.polarizationRotation)
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
      throw new Error('Invalid laser direction')
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

function runTsSimulation(board: Board, maxFrames: number, state: Vector): Simulation {
  const simulation = new QTSimulation(board.width, board.height, generateOperators(board))
  const frame = new QTFrame(simulation)
  frame.vector = state
  simulation.frames.push(frame)
  simulation.generateFrames(maxFrames)
  return importSimulation(simulation)
}

function wasmAngle(rot: Rotation): Angle {
  switch (rot) {
    case Rotation.Right:
      return Angle.Right
    case Rotation.UpRight:
      return Angle.UpRight
    case Rotation.Up:
      return Angle.Up
    case Rotation.UpLeft:
      return Angle.UpLeft
    case Rotation.Left:
      return Angle.Left
    case Rotation.DownLeft:
      return Angle.DownLeft
    case Rotation.Down:
      return Angle.Down
    case Rotation.DownRight:
      return Angle.DownRight
    default:
      assertUnreachable(rot)
  }
}

function wasmDirection(rot: Rotation): Direction {
  switch (rot) {
    case Rotation.Right:
      return Direction.Right
    case Rotation.Up:
      return Direction.Up
    case Rotation.Left:
      return Direction.Left
    case Rotation.Down:
      return Direction.Down
    default:
      throw new Error(`Invalid direction ${rot}`)
  }
}

function runRustSimulation(board: Board, maxFrames: number, state: Vector): Simulation {
  // const state = initialState
  //   ? initialState.toBasisAll('polarization', 'HV')
  //   : generateLaserState(board)

  let builder = SimulationBuilder.new(board.width, board.height)

  for (const entry of state.entries) {
    const [x, y, dir, pol] = entry.coord
    const val = entry.value
    builder = builder.with_entry(RustCoord.new(x, y), dir, pol, RustComplex.new(val.re, val.im))
  }

  for (const [coord, piece] of board.pieces) {
    const c = RustCoord.new(coord.x, coord.y)
    switch (piece.type) {
      case Elem.Wall:
        builder = builder.with_wall(c)
        break
      case Elem.Rock:
        builder = builder.with_rock(c)
        break
      case Elem.Gate:
        builder = builder.with_gate(c)
        break
      case Elem.Mine:
        builder = builder.with_mine(c)
        break
      case Elem.Glass:
        builder = builder.with_glass(c)
        break
      case Elem.VacuumJar:
        builder = builder.with_vacuum_jar(c)
        break
      case Elem.CornerCube:
        builder = builder.with_corner_cube(c)
        break
      case Elem.NonLinearCrystal:
        builder = builder.with_non_linear_crystal(c)
        break
      case Elem.Laser:
        builder = builder.with_laser(c, wasmDirection(piece.rotation))
        break
      case Elem.Mirror:
        builder = builder.with_mirror(c, wasmAngle(piece.rotation))
        break
      case Elem.BeamSplitter:
        builder = builder.with_beam_splitter(c, wasmAngle(piece.rotation), piece.split)
        break
      case Elem.PolarizingBeamSplitter:
        builder = builder.with_polarizing_beam_splitter(c, wasmAngle(piece.rotation))
        break
      case Elem.CoatedBeamSplitter:
        builder = builder.with_beam_splitter(c, wasmAngle(piece.rotation), piece.split)
        break
      case Elem.Detector:
        builder = builder.with_detector(c, wasmDirection(piece.rotation))
        break
      case Elem.Absorber:
        builder = builder.with_absorber(c, piece.absorption)
        break
      case Elem.DetectorFour:
        builder = builder.with_detector_four(c)
        break
      case Elem.Polarizer:
        builder = builder.with_polarizer(c, wasmAngle(piece.rotation))
        break
      case Elem.QuarterWavePlate:
        builder = builder.with_quarter_wave_plate(c, wasmAngle(piece.rotation))
        break
      case Elem.HalfWavePlate:
        builder = builder.with_half_wave_plate(c, wasmAngle(piece.rotation))
        break
      case Elem.SugarSolution:
        builder = builder.with_sugar_solution(c, piece.polarizationRotation)
        break
      case Elem.FaradayRotator:
        builder = builder.with_faraday_rotator(
          c,
          wasmDirection(piece.rotation),
          piece.polarizationRotation
        )
        break
      default:
        assertUnreachable(piece)
    }
  }

  const dims = [
    Dimension.position(board.width, 'x'),
    Dimension.position(board.height, 'y'),
    Dimension.direction(),
    Dimension.polarization(),
  ]

  const frames = builder.simulate(maxFrames).map((f) => {
    const absorptions = new Map<Coord, number>()

    for (const abs of f.absorptions()) {
      const c = Coord.new(abs.coord.x, abs.coord.y)
      absorptions.set(c, (absorptions.get(c) ?? 0) + abs.probability)
    }

    return {
      particles: f.particles().map(
        (p): Particle => {
          return {
            coord: Coord.new(p.coord.x, p.coord.y),
            direction: p.direction,
            a: Cx(p.a.re, p.a.im),
            b: Cx(p.b.re, p.b.im),
          }
        }
      ),
      vector: new Vector(
        f.entries().map(([coord, d, p, val]) => {
          return new VectorEntry([coord.x, coord.y, d, p], new Complex(val.im, val.re))
        }),
        dims
      ),
      absorptions,
    }
  })

  return {
    frames,
    upToFrameAbsorptions: importAbsorptions(frames),
  }
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

  if ($flags.rust) {
    return runRustSimulation(board, maxFrames, state)
  } else {
    return runTsSimulation(board, maxFrames, state)
  }
}
