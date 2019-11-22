import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
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

  polarization: string;

  constructor(polarization: string = 'H') {
    super(Elem.Laser, Group.Source);
    this.polarization = polarization;
  }

  transition() {
    return qt.attenuator(0);
  }
}
