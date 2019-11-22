import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * DETECTOR CLASS
 */
export default class Detector extends Element {
  name: Elem = Elem.Detector;
  group: Group = Group.Absorption;
  description: string =
    'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!';
  ascii: string[] = ['⭲', '⭱', '⭰', '⭳'];
  angles: number[] = [0, 90, 180, 270];

  constructor() {
    super(Elem.Detector, Group.Absorption);
  }

  transition() {
    return qt.attenuator(0);
  }
}
