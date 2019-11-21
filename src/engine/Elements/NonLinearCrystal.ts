import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * NON LINEAR CRYSTAL CLASS
 */
export default class NonLinearCrystal extends Element {
  name: string = Elem.NonLinearCrystal;
  group: string = Group.Source;
  description: string = 'A BBO crystal.';
  ascii: string[] = ['>', '^', '<', 'v'];

  constructor() {
    super(Elem.NonLinearCrystal, Group.Source);
  }

  transition() {
    return qt.attenuator(1);
  }

}
