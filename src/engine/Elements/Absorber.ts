import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * ABSORBER CLASS
 */
export default class Absorber extends Element {
  name: Elem = Elem.Absorber;
  group: Group = Group.Absorption;
  description: string = 'Filter with 50% absorption probability.';
  ascii: string[] = ['A'];
  angles: number[] = [0];

  percentage: number = Math.SQRT1_2;

  constructor(percentage: number = Math.SQRT1_2) {
    super(Elem.Absorber, Group.Absorption);
    this.percentage = percentage;
  }

  transition(options: TransitionInterface) {
    return qt.attenuator(Math.SQRT1_2);
    // return qt.attenuator(options.percentage);
  }
}
