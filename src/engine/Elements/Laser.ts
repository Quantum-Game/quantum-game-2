import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * LASER CLASS
 */
export default class Laser extends Element {
  name: string = Elem.Laser;
  group: string = Group.Source;
  description: string = 'An on-demand single photon source.';
  ascii: string[] = ['>', '^', '<', 'v'];
  polarization: string;

  constructor(polarization: string = 'H') {
    super(Elem.Laser, Group.Source);
    this.polarization = polarization;
  }

  transition() {
    return qt.attenuator(0);
  }
}
