import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * POLARIZER CLASS
 */
export default class Polarizer extends Element {
  name: string = Elem.Polarizer;
  group: string = Group.Polarization;
  description: string =
    'A polarization filter... Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.';
  ascii: string[] = ['🡢', '🡥', '🡢', '🡥'];

  rotation: number = 0;
  polarization: number = 0;

  constructor(rotation: number = 0, polarization: number = 0) {
    super(Elem.Polarizer, Group.Polarization);
    this.rotation = rotation;
    this.polarization = polarization;
  }

  transition() {
    return qt.polarizer(this.rotation, this.polarization);
  }
}
