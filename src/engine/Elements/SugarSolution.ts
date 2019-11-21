import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * SUGAR SOLUTION CLASS
 */
export default class SugarSolution extends Element {
  name: string = Elem.SugarSolution;
  group: string = Group.Polarization;
  description: string =
    'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.';
  ascii: string[] = ['S'];

  sugar: number = 0.125;

  constructor(sugar: number = 0.125) {
    super(Elem.SugarSolution, Group.Polarization);
    this.sugar = sugar;
  }

  transition() {
    return qt.sugarSolution(this.sugar);
  }
}
