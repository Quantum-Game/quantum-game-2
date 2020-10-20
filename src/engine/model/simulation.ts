import {
  IGrid as QTGrid,
  ICell as QTCell,
  IParticle as QTParticle,
} from 'quantum-tensors/dist/interfaces'
import { Simulation as QTSimulation, Frame as QTFrame, Vector, Complex } from 'quantum-tensors'
import { Board, Piece } from './level'
import { exportElem } from './elem'
import { Coord } from './coord'
import { Direction, directionFromDegrees } from './direction'
import { rotationToDegrees } from './rotation'
import { groupReduceBy } from '@/itertools'

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

function importParticle(particle: QTParticle): Particle {
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

function exportSimGrid(board: Board): QTGrid {
  return {
    rows: board.height,
    cols: board.width,
    cells: Array.from<[Coord, Piece]>(board.pieces).map(exportSimCell),
  }
}

function exportSimCell([coord, piece]: [Coord, Piece]): QTCell {
  return {
    x: coord.x,
    y: coord.y,
    element: exportElem(piece.type),
    rotation: rotationToDegrees(piece.rotation),
    polarization: rotationToDegrees(piece.polarization),
  }
}

export function runSimulation(board: Board, maxFrames: number, initialState?: Vector): Simulation {
  const newSim = new QTSimulation(exportSimGrid(board))
  if (initialState != null) {
    const frame = new QTFrame(newSim)
    frame.vector = initialState.toBasisAll('polarization', 'HV')
    newSim.frames.push(frame)
  } else {
    newSim.initializeFromIndicator(newSim.generateLaserIndicator())
  }
  newSim.generateFrames(maxFrames)
  return importSimulation(newSim)
}
