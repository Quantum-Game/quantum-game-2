import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * DETECTOR FOUR CLASS
 */
export default class DetectorFour extends Element {
  name: Elem = Elem.DetectorFour;
  group: Group = Group.Absorption;
  description: string =
    'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.';
  ascii: string[] = ['O'];
  angles: number[] = [0];

  rotation: number = 0;
  polarization: number = 0;
  percentage: number = 0;

  constructor() {
    super(Elem.DetectorFour, Group.Absorption);
  }

  transition() {
    return qt.attenuator(0);
  }
}
