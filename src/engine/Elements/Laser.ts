import * as qt from 'quantum-tensors';
import {
  Elem,
  Group,
  TransitionInterface,
  LaserDirection,
  LaserPolarization
} from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * LASER CLASS
 */
export default class Laser extends Element {
  name: Elem = Elem.Laser;
  group: Group = Group.Source;
  description: string = 'An on-demand single photon source.';
  ascii: string[] = ['>', '^', '<', 'v'];
  angles: number[] = [0, 90, 180, 270];

  polarization: number = 0;

  constructor(polarization: number = 0) {
    super(Elem.Laser, Group.Source);
    this.polarization = polarization;
  }

  /**
   * Output an enum describing laser starting polarization
   */
  get startingPolarization(): LaserPolarization {
    switch (this.polarization) {
      case 0:
      case 180:
        return LaserPolarization.H;
      case 90:
      case 270:
        return LaserPolarization.V;
      default:
        throw new Error(`Wrong starting polarization: ${this.polarization}`);
    }
  }

  transition(options: TransitionInterface): qt.Operator {
    return qt.attenuator(0);
  }
}
