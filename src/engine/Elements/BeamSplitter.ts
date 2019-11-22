import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
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

  percentage: number = 50;

  constructor(percentage: number = 50) {
    super(Elem.BeamSplitter, Group.Direction);
    this.percentage = percentage;
  }

  transition(options: TransitionInterface) {
    return qt.beamSplitter(options.rotation);
  }
}
