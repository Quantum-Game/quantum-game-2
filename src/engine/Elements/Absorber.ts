import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * ABSORBER CLASS
 */
export default class Absorber extends Element {
  name: string = Elem.Absorber;
  group: string = Group.Absorption;
  description: string = 'Filter with 50% absorption probability.';
  ascii: string[] = ['░'];

  constructor() {
    super(Elem.Absorber, Group.Absorption);
  }

  transition() {
    return qt.attenuator(Math.SQRT1_2);
  }
}
