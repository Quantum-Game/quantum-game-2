import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * BEAMSPLITTER CLASS
 */
export default class BeamSplitter extends Element {
  name: string = Elem.BeamSplitter;
  group: string = Group.Direction;
  description: string =
    'A thin slab of glass reflecting half the beam, and transmitting other half of it.';
  ascii: string[] = ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'];

  rotation: number;
  percentage: number;

  constructor(rotation: number = 0, percentage = 50) {
    super(Elem.BeamSplitter, Group.Direction);
    this.rotation = rotation;
    this.percentage = percentage;
  }

  transition() {
    return qt.beamSplitter(this.rotation);
  }
}
