import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * POLARIZER CLASS
 */
export default class Polarizer extends Element {
  name: Elem = Elem.Polarizer;
  group: Group = Group.Polarization;
  description: string =
    'A polarization filter... Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.';
  ascii: string[] = ['🡢', '🡥', '🡢', '🡥'];
  angles: number[] = [0, 90, 180, 270];

  polarization: number = 0;

  constructor(polarization: number = 0) {
    super(Elem.Polarizer, Group.Polarization);
    this.polarization = polarization;
  }

  transition(rotation: number = 0, polarization: number = 0) {
    return qt.polarizer(rotation, polarization);
  }
}
