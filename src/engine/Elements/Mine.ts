import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * MINE CLASS
 */
export default class Mine extends Element {
  name: string = Elem.Mine;
  group: string = Group.Absorption;
  description: string =
    'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.';
  ascii: string[] = ['!'];

  constructor() {
    super(Elem.Mine, Group.Absorption);
  }

  transition() {
    return qt.attenuator(0);
  }
}
