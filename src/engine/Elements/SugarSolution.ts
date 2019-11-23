import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * SUGAR SOLUTION CLASS
 */
export default class SugarSolution extends Element {
  name: Elem = Elem.SugarSolution;
  group: Group = Group.Polarization;
  description: string =
    'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.';
  ascii: string[] = ['S'];
  angles: number[] = [0];

  percentage: number = 0.125;

  constructor(percentage: number = 0.125) {
    super(Elem.SugarSolution, Group.Polarization);
    this.percentage = percentage;
  }

  transition(options: TransitionInterface): qt.Operator {
    // return qt.sugarSolution(options.percentage);
    return qt.sugarSolution(0.125);
  }
}
