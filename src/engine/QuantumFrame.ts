import _ from 'lodash'
import * as qt from 'quantum-tensors'

import Coord from './Coord'
import Particle from './Particle'
import {
  AbsorptionInterface,
  ParticleInterface,
  ParticleCoordInterface,
  DetectionInterface
} from './interfaces'

// TODO: Create primitive interface and associated class and move to interfaces.ts
export interface KetComponentInterface {
  amplitude: qt.Complex
  particleCoords: ParticleCoordInterface[]
}

/**
 * QUANTUM FRAME CLASS
 * QuantumFrame is essentially a wrapper on Photons from qunatum-tensors.
 * It hold quantum state at a given time, and nothing more.
 * All other things are accessible with getters.
 * @todo Make it immutable? Make photons private or expose?
 */
export default class QuantumFrame {
  public readonly photons: qt.Photons
  public absorptions: AbsorptionInterface[]
  // TODO: later we may need to clean such low values within the engine
  public probThreshold = 1e-6
  // things below right now mostly for debugging puroses
  public probBefore: number
  public probPropagated?: number
  public probAfter?: number

  public constructor(sizeX: number, sizeY: number, photons = new qt.Photons(sizeX, sizeY)) {
    this.photons = photons
    this.absorptions = []
    this.probBefore = this.probability
  }

  public static fromPhotons(photons: qt.Photons): QuantumFrame {
    return new QuantumFrame(photons.sizeX, photons.sizeY, photons.copy())
  }

  public get ket(): qt.Vector {
    return this.photons.vector
  }

  public get ketString(): string {
    return this.photons.ketString()
  }

  public get ketComponents(): KetComponentInterface[] {
    const ns = _.range(this.photons.nPhotons)
    return this.photons.vector.entries
      .map(
        (entry): KetComponentInterface => {
          const particleCoords = ns.map(
            (i): ParticleCoordInterface => {
              const [x, y, dir, pol] = entry.coord.slice(4 * i, 4 * i + 4)
              return { kind: 'photon', x, y, dir, pol }
            }
          )
          return {
            amplitude: entry.value,
            particleCoords
          }
        }
      )
      .filter(
        (ketComponent: KetComponentInterface): boolean =>
          ketComponent.amplitude.r ** 2 > this.probThreshold
      )
  }

  /**
   * State vector norm.
   */
  public get probability(): number {
    return this.photons.vector.normSquared()
  }

  public propagateAndInteract(operatorList: [number, number, qt.Operator][]): void {
    if (this.probPropagated !== undefined) {
      throw new Error('You cannot propagateAndInteract more times with the same frame!')
    }
    this.photons.propagatePhotons()
    this.probPropagated = this.probability
    // TODO: Rework array into interface
    this.absorptions = operatorList
      .map(
        ([x, y, op]): DetectionInterface => {
          return {
            coord: { x, y },
            probability: this.photons.measureAbsorptionAtOperator(x, y, op)
          }
        }
      )
      .filter((d): boolean => d.probability > this.probThreshold)
    if (this.probBefore - this.probPropagated > this.probThreshold) {
      this.absorptions.push({
        coord: { x: -1, y: -1 },
        probability: this.probBefore - this.probPropagated
      })
    }
    this.photons.actOnSinglePhotons(operatorList)
    this.probAfter = this.probability
  }

  // should be same as this.probAfter
  public get totalProbabilityLoss(): number {
    return this.absorptions
      .map((absorption): number => absorption.probability)
      .reduce((a, b): number => a + b, 0)
  }

  /**
   * @note Coord and Particle will need a serious rewrite
   */
  public get polarizationSuperpositions(): Particle[] {
    return this.photons
      .aggregatePolarization()
      .map(
        (q: ParticleInterface): Particle => {
          const coord = Coord.importCoord(q)
          return new Particle(coord, q.direction, q.are, q.aim, q.bre, q.bim)
        }
      )
      .filter((particle: Particle): boolean => particle.probability > this.probThreshold)
  }

  /**
   * Shorthand for polarization superpositions
   * @remark From Piotr: well, I created name polarizationSuperpositions exactly
   * to avoid words like particle, which is confusing, and has many meanings
   * in the context of the game.
   */
  public get particles(): Particle[] {
    return this.polarizationSuperpositions
  }
}
