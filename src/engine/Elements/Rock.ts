import * as qt from 'quantum-tensors';
import { Elem, Group } from '@/engine/interfaces';
import Element from '@/engine/Element';

/**
 * ROCK CLASS
 */
export default class Rock extends Element {
  name: string = Elem.Rock;
  group: string = Group.Absorption;
  description: string =
    "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.";
  ascii: string[] = ['♜'];

  constructor() {
    super(Elem.Laser, Group.Source);
  }

  transition() {
    return qt.attenuator(0);
  }
}
