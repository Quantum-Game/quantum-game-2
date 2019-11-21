import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * DETECTOR FOUR CLASS
 */
export default class DetectorFour extends Element {
  name: string = Elem.DetectorFour;
  group: string = Group.Absorption;
  description: string =
    'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.';
  ascii: string[] = ['O'];

  constructor() {
    super(Elem.DetectorFour, Group.Absorption);
  }

  transition() {
    return qt.attenuator(0);
  }
}
