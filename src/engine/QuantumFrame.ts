import _ from 'lodash';
import * as qt from 'quantum-tensors';

import Coord from './Coord';
import Particle, { Qparticle } from './Particle';

export interface AbsorptionsInterface {
  x: number;
  y: number;
  probability: number;
}

export interface particleCoordInterface {
  kind: string; // for now only 'photon'
  x: number;
  y: number;
  dir: number; // 0: > 1: ^, 2: <. 3: v
  pol: number; // 0: H, 1: V
}

export interface ketComponentInterface {
  amplitude: qt.Complex;
  particleCoords: particleCoordInterface[];
}

/**
 * QuantumFrame is essentially a wrapper on Photons from qunatum-tensors.
 * It hold quantum state at a given time, and nothing more.
 * All other things are accessible with getters.
 * @todo Make it immutable? Make photons private or expose?
 */
export default class QuantumFrame {
  readonly photons: qt.Photons;
  absorptions: AbsorptionsInterface[];
  // note: later we may need to clean such low values within the engine
  probThreshold = 1e-6;
  // things below right now mostly for debugging puroses
  probBefore: number;
  probPropagated?: number;
  probAfter?: number;

  constructor(sizeX: number, sizeY: number, photons = new qt.Photons(sizeX, sizeY)) {
    this.photons = photons;
    this.absorptions = [];
    this.probBefore = this.probability;
  }

  static fromPhotons(photons: qt.Photons): QuantumFrame {
    return new QuantumFrame(photons.sizeX, photons.sizeY, photons.copy());
  }

  get ket(): qt.Vector {
    return this.photons.vector;
  }

  get ketString(): string {
    return this.photons.ketString();
  }

  get ketComponents(): ketComponentInterface[] {
    const ns = _.range(this.photons.nPhotons);
    return this.photons.vector.entries
      .map((entry) => {
        const particleCoords = ns.map((i) => {
          const [x, y, dir, pol] = entry.coord.slice(4 * i, 4 * i + 4);
          return { kind: 'photon', x, y, dir, pol };
        });
        return {
          amplitude: entry.value,
          particleCoords
        };
      })
      .filter((ketComponent) => ketComponent.amplitude.r ** 2 > this.probThreshold);
  }

  /**
   * State vector norm.
   */
  get probability(): number {
    return this.photons.vector.normSquared();
  }

  propagateAndInteract(operatorList: [number, number, qt.Operator][]): void {
    if (this.probPropagated !== undefined) {
      throw new Error('You cannot propagateAndInteract more times with the same frame!');
    }
    this.photons.propagatePhotons();
    this.probPropagated = this.probability;
    this.absorptions = operatorList
      .map(([x, y, op]) => ({
        x,
        y,
        probability: this.photons.measureAbsorptionAtOperator(x, y, op)
      }))
      .filter((d) => d.probability > this.probThreshold);
    if (this.probBefore - this.probPropagated > this.probThreshold) {
      this.absorptions.push({
        x: -1,
        y: -1,
        probability: this.probBefore - this.probPropagated
      });
    }
    this.photons.actOnSinglePhotons(operatorList);
    this.probAfter = this.probability;
  }

  get totalProbabilityLoss(): number {
    return this.absorptions.map((absorption) => absorption.probability).reduce((a, b) => a + b, 0);
    // should be same as this.probAfter
  }

  /**
   * @note Coord and Particle will need a serious rewrite
   */
  get polarizationSuperpositions(): Particle[] {
    return this.photons
      .aggregatePolarization()
      .map((q: Qparticle) => {
        const coord = new Coord(q.y, q.x);
        return new Particle(coord, q.direction, 0, 0, q.are, q.aim, q.bre, q.bim);
      })
      .filter((particle) => particle.probability > this.probThreshold);
  }

  /**
   * Shorthand for polarization superpositions
   * @remark From Piotr: well, I created name polarizationSuperpositions excatly
   * to avoid words like particle, which is confusing, and has many meanings
   * in the context of the game.
   */
  get particles(): Particle[] {
    return this.polarizationSuperpositions;
  }
}
