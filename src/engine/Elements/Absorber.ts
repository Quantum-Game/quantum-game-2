import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * ABSORBER CLASS
 */
export default class Absorber extends Element {
  name: Elem = Elem.Absorber;
  group: Group = Group.Absorption;
  description: string = 'Filter with 50% absorption probability.';
  ascii: string[] = ['>', '^', '<', 'v'];
  angles: number[] = [0];

  percentage: number;

  constructor(percentage: number = Math.SQRT1_2) {
    super(Elem.Absorber, Group.Absorption);
    this.percentage = percentage;
  }

  transition() {
    return qt.attenuator(this.percentage);
  }
}
