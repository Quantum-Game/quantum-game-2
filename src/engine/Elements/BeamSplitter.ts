import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * BEAMSPLITTER CLASS
 */
export default class BeamSplitter extends Element {
  name: Elem = Elem.BeamSplitter;
  group: Group = Group.Direction;
  description: string =
    'A thin slab of glass reflecting half the beam, and transmitting other half of it.';
  ascii: string[] = ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'];
  angles: number[] = [0, 45, 90, 135, 180, 225, 270, 315];

  rotation: number;
  percentage: number;

  constructor(rotation: number = 0, percentage: number = 50) {
    super(Elem.BeamSplitter, Group.Direction);
    this.rotation = rotation;
    this.percentage = percentage;
  }

  transition() {
    return qt.beamSplitter(this.rotation);
  }
}
