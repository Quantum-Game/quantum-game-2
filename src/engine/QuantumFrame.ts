import * as qt from 'quantum-tensors';

import Coord from './Coord';
import Particle, { Qparticle } from './Particle';

/**
 * QuantumFrame is essentially a wrapper on Photons from qunatum-tensors.
 * It hold quantum state at a given time, and nothing more.
 * All other things are accessible with getters.
 * @todo Make it immutable? Make photons private or expose?
 */
export default class QuantumFrame {
  readonly photons: qt.Photons;

  constructor(sizeX: number, sizeY: number) {
    this.photons = new qt.Photons(sizeX, sizeY);
  }

  get ket(): qt.Vector {
    return this.photons.vector;
  }

  get ketString(): string {
    return this.photons.ketString();
  }

  get probability(): number {
    return this.photons.vector.normSquared();
  }

  /**
   * @note Coord and Partile will need a serious rewrite
   */
  get polarizationSuperpositions(): Particle[] {
    return this.photons.aggregatePolarization().map((q: Qparticle) => {
      const coord = new Coord(q.y, q.x);
      return new Particle(coord, q.direction, 0, 0, q.are, q.aim, q.bre, q.bim);
    });
  }

  /**
   * Shorthand for polarization superpositions
   */
  get particles() {
    return this.polarizationSuperpositions;
  }
}
