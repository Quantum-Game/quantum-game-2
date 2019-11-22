import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * MINE CLASS
 */
export default class Mine extends Element {
  name: Elem = Elem.Mine;
  group: Group = Group.Absorption;
  description: string =
    'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.';
  ascii: string[] = ['!'];
  angles: number[] = [0];

  constructor() {
    super(Elem.Mine, Group.Absorption);
  }

  transition(options: TransitionInterface) {
    return qt.attenuator(0);
  }
}
