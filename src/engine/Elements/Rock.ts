import * as qt from 'quantum-tensors';
import { Elem, Group, TransitionInterface } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * ROCK CLASS
 */
export default class Rock extends Element {
  name: Elem = Elem.Rock;
  group: Group = Group.Absorption;
  description: string =
    "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.";
  ascii: string[] = ['♜'];
  angles: number[] = [0];

  constructor() {
    super(Elem.Laser, Group.Source);
  }

  transition(options: TransitionInterface) {
    return qt.attenuator(0);
  }
}
