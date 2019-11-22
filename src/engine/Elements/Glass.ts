import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * GLASS CLASS
 */
export default class Glass extends Element {
  name: Elem = Elem.Glass;
  group: Group = Group.Phase;
  description: string =
    'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.';
  ascii: string[] = ['↜'];

  // TODO: See how the phase shift should be encoded
  percentage: number = 0.25;

  constructor(percentage: number = 0.25) {
    super(Elem.Glass, Group.Phase);
    this.percentage = percentage;
  }

  transition() {
    return qt.glassSlab();
  }
}
