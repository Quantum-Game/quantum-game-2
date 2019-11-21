import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * GLASS CLASS
 */
export default class Glass extends Element {
  name: string = Elem.Glass;
  group: string = Group.Phase;
  description: string =
    'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.';
  ascii: string[] = ['↜'];

  constructor() {
    super(Elem.Glass, Group.Phase);
  }

  transition() {
    return qt.glassSlab();
  }
}
